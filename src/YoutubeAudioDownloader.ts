import fs from 'fs';
import youtubeDlExec from 'youtube-dl-exec';
import { YoutubeMetadata } from './YoutubeMetadata';

export class YoutubeAudioDownloader {
  static async download(url: string, youtubeMetadata?: YoutubeMetadata) {
    const fileName = escapeFileName(
      youtubeMetadata ? `${youtubeMetadata.artist} - ${youtubeMetadata.title}.%(ext)s` : '%(title)s.%(ext)s'
    );

    const cookieFileExists = process.env.COOKIE_FILE_PATH ? fs.existsSync(process.env.COOKIE_FILE_PATH) : false;

    youtubeDlExec(url, {
      format: 'bestaudio[ext=mp3]/bestaudio[ext=mp4]/bestaudio[ext=m4a]/bestaudio[ext=ogg]',
      output: `./output/${fileName}`,
      embedThumbnail: true,
      ...(cookieFileExists && {
        cookies: './cookies.txt',
      }),
      ...(youtubeMetadata && {
        postprocessorArgs: `-metadata artist=${youtubeMetadata.artist.replace(
          / /g,
          '\\ '
        )} -metadata title=${youtubeMetadata.title.replace(/ /g, '\\ ')}`,
      }),
    }).then((output) => console.log(output + '\n'));
  }
}

function escapeFileName(fileName: string) {
  return fileName
    .replace(/\\/g, '＼')
    .replace(/\//g, '／')
    .replace(/\:/g, '：')
    .replace(/\*/g, '＊')
    .replace(/\?/g, '？')
    .replace(/\"/g, '＂')
    .replace(/\</g, '＜')
    .replace(/\>/g, '＞')
    .replace(/\|/g, '｜');
}
