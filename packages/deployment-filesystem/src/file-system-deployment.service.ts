import {Page} from '@baya/core';
import {HtmlPage} from '@baya/core';
import {BaseDeployment} from '@baya/core';
import {Sitemap} from '@baya/core';
import {Redirect} from '@baya/core';
import {FileSystemDeploymentConfig} from './file-system-deployment.config';
import winston = require('winston');
import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import {Asset} from '@baya/core';
import {RssFeed} from '@baya/core';

export class FileSystemDeployment extends BaseDeployment {

    private deployTo: string;

    constructor(config: FileSystemDeploymentConfig) {
        super();
        this.deployTo = path.resolve(config.folder);
    }

    deployPage(page: HtmlPage, html: string): void {
        const filePath: string = this.toFilePath(page);
        fs.writeFileSync(filePath, html, {encoding: 'utf-8'});
        winston.info(`[deployment] Published page ${page.url} to file ${filePath}`);
    }

    deployRss(page: RssFeed, xml: string): void {
        const filePath: string = this.toFilePath(page, 'xml');
        fs.writeFileSync(filePath, xml, {encoding: 'utf-8'});
        winston.info(`[deployment] Published rss ${page.url} to file ${filePath}`);
    }

    deploySitemap(sitemap: Sitemap, xml: string): void {
        const filePath: string = this.deployTo.replace(/\/+$/, '') + `/sitemap.xml`;
        fs.writeFileSync(filePath, xml, {encoding: 'utf-8'});
        winston.info(`[deployment] Published sitemap to file ${filePath}`);
    }

    deployRedirect(redirect: Redirect): void {
        const filePath: string = this.toFilePath(redirect);
        fs.writeFileSync(filePath, `Redirect to: ${redirect.to}`, {encoding: 'utf-8'});
        winston.info(`[deployment] Published redirect ${redirect.url} to ${filePath}`);
    }

    deployAsset(asset: Asset): void {
        const filePath: string = this.toAssetFilePath(asset);
        if (!this.isAssetFilePresent(filePath) || this.isAssetExpired(filePath)) {
            asset.content.subscribe((loadedContent: string) => {
                fs.writeFileSync(filePath, loadedContent, 'binary');
                winston.info(`[deployment] Published asset ${asset.url} to ${filePath}`);
            });
        }
    }

    private toFilePath(page: Page, fileExtension: string = 'html'): string {
        const folder: string = this.deployTo.replace(/\/+$/, '') + '/' + page.url.toString(false);
        mkdirp.sync(folder);
        const fileName: string = '/index.' + fileExtension;
        return folder + fileName;
    }

    private isAssetFilePresent(filePath: string) {
        return fs.existsSync(filePath);
    }

    /**
     * Checks if a local asset is considered "expired" and should be downloaded again.
     *
     * By default, assets expired after 7 days, except images expire after 60 days.
     */
    private isAssetExpired(filePath: string) {
        if (!this.isAssetFilePresent(filePath)) {
            return true;
        }

        let expiredAfterDays: number = 7;
        if (filePath.endsWith('.jpg')
            || filePath.endsWith('.jpeg')
            || filePath.endsWith('.png')
            || filePath.endsWith('.svg')) {
            expiredAfterDays = 60;
        }

        const expiredAfterMs: number = expiredAfterDays * 24 * 60 * 60 * 1000;
        const assetStat: fs.Stats = fs.statSync(filePath);
        const nowMs: number = new Date().getTime();
        if (nowMs - assetStat.mtime.getTime() > expiredAfterMs) {
            winston.silly(`[deployment] Asset expired: ${filePath}`);
            return true;
        }
        return false;
    }

    private toAssetFilePath(page: Page): string {
        const filePath: string = this.deployTo.replace(/\/+$/, '') + '/' + page.url.toString(false);
        mkdirp.sync(path.dirname(filePath));
        return filePath;
    }
}
