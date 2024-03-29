import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ListBucketsCommand,
    ListObjectsV2Command,
    ObjectIdentifier,
    PutObjectCommand,
    S3Client
} from '@aws-sdk/client-s3';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Readable} from 'stream';
import {IAwsS3PutItemOptions, IAwsS3Response} from '../aws.interface';
import {S3} from "aws-sdk";

@Injectable()
export class AwsS3Service {
    private readonly s3Client: S3Client;
    private readonly bucket: string;
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId:
                    this.configService.get<string>('aws.credential.key'),
                secretAccessKey: this.configService.get<string>(
                    'aws.credential.secret'
                ),
            },
            region: this.configService.get<string>('aws.s3.region'),
        });


        this.bucket = this.configService.get<string>('aws.s3.bucket');
        this.baseUrl = this.configService.get<string>('aws.s3.baseUrl');
    }

    async listBucket(): Promise<string[]> {
        const command: ListBucketsCommand = new ListBucketsCommand({});
        const listBucket: Record<string, any> = await this.s3Client.send(
            command
        );
        return listBucket.Buckets.map((val: Record<string, any>) => val.Name);
    }

    async listItemInBucket(prefix?: string): Promise<IAwsS3Response[]> {
        const command: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: prefix,
        });
        const listItems: Record<string, any> = await this.s3Client.send(
            command
        );

        return listItems.Contents.map((val: Record<string, any>) => {
            const lastIndex: number = val.Key.lastIndexOf('/');
            const path: string = val.Key.substring(0, lastIndex);
            const filename: string = val.Key.substring(
                lastIndex,
                val.Key.length
            );
            const mime: string = filename
                .substring(filename.lastIndexOf('.') + 1, filename.length)
                .toLocaleUpperCase();

            return {
                path,
                pathWithFilename: val.Key,
                filename: filename,
                completedUrl: `${this.baseUrl}/${val.Key}`,
                baseUrl: this.baseUrl,
                mime,
            };
        });
    }

    public async generatePreSignedUrl(key: string) {
        const s3 = new S3({
            credentials: {
                accessKeyId:
                    this.configService.get<string>('aws.credential.key'),
                secretAccessKey: this.configService.get<string>(
                    'aws.credential.secret'
                ),
            }
        });
        return s3.getSignedUrlPromise('getObject', {
            Bucket: this.configService.get<string>('aws.s3.bucket'),
            Key: key
        })
    }

    async getBufferFromS3(file, callback){
        const buffers = [];
        const s3 = new S3({
            credentials: {
                accessKeyId:
                    this.configService.get<string>('aws.credential.key'),
                secretAccessKey: this.configService.get<string>(
                    'aws.credential.secret'
                ),
            }
        });
        const stream = s3.getObject({ Bucket:  this.configService.get<string>('aws.s3.bucket'), Key: file}).createReadStream();
        stream.on('data', data => buffers.push(data));
        stream.on('end', () => callback(null, Buffer.concat(buffers)));
        stream.on('error', error => callback(error));
    }

    async getBufferFromS3Promise(file) {
        return new Promise((resolve, reject) => {
            this.getBufferFromS3(file, (error, s3buffer) => {
                if (error) return reject(error);
                return resolve(s3buffer);
            });
        });
    };

    async getItemInBucketBodyData(
        filename: string,
        path?: string
    ): Promise<Record<string, any>> {
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
            });
        if (path)
            path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

        const key: string = path ? path : filename;
        const command: GetObjectCommand = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        const item: Record<string, any> = await this.s3Client.send(command);
        return await streamToString(item.Body);
    }

    async getItemInBucket(
        filename: string,
        path?: string
    ): Promise<any> {
        const key: string = path ? path : filename;
        return await this.generatePreSignedUrl(key);
    }

    async putItemInBucket(
        filename: string,
        content:
            | string
            | Uint8Array
            | Buffer
            | Readable
            | ReadableStream
            | Blob,
        options?: IAwsS3PutItemOptions
    ): Promise<IAwsS3Response> {
        let path: string = options && options.path ? options.path : undefined;
        const acl: string =
            options && options.acl ? options.acl : 'public-read';
        if (path)
            path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toUpperCase();
        const key: string = path ? `${path}/${filename}` : filename;
        const command: PutObjectCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: content,
            ACL: acl,
        });
        await this.s3Client.send(command);

        return {
            path,
            pathWithFilename: key,
            filename: filename,
            completedUrl: `${this.baseUrl}/${key}`,
            baseUrl: this.baseUrl,
            mime,
        };
    }

    async deleteItemInBucket(filename: string): Promise<boolean> {
        const command: DeleteObjectCommand = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: filename,
        });

        try {
            await this.s3Client.send(command);
            return true;
        } catch (e) {
            return false;
        }
    }

    async deleteItemsInBucket(filenames: string[]): Promise<boolean> {
        const keys: ObjectIdentifier[] = filenames.map((val) => ({
            Key: val,
        }));
        const command: DeleteObjectsCommand = new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: {
                Objects: keys,
            },
        });

        try {
            await this.s3Client.send(command);
            return true;
        } catch (e) {
            return false;
        }
    }

    async deleteFolder(dir: string): Promise<boolean> {
        const commandList: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: dir,
        });
        const lists = await this.s3Client.send(commandList);

        try {
            const listItems = lists.Contents.map((val) => ({
                Key: val.Key,
            }));
            const commandDeleteItems: DeleteObjectsCommand =
                new DeleteObjectsCommand({
                    Bucket: this.bucket,
                    Delete: {
                        Objects: listItems,
                    },
                });

            await this.s3Client.send(commandDeleteItems);

            const commandDelete: DeleteObjectCommand = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: dir,
            });
            await this.s3Client.send(commandDelete);

            return true;
        } catch (e) {
            return false;
        }
    }
}
