import youtubeDlExec from 'youtube-dl-exec';
import { YoutubeMetadata } from './YoutubeMetadata';

export class YoutubeAudioDownloader {
  static async download(url: string, youtubeMetadata?: YoutubeMetadata) {
    const fileName = youtubeMetadata
      ? `./output/${youtubeMetadata.artist} - ${youtubeMetadata.title}.%(ext)s`
      : './output/%(title)s.%(ext)s';

    youtubeDlExec(url, {
      format: 'bestaudio[ext=mp3]/bestaudio[ext=mp4]/bestaudio[ext=m4a]/bestaudio[ext=ogg]',
      output: fileName,
      embedThumbnail: true,
      ...(youtubeMetadata && {
        postprocessorArgs: `-metadata artist=${youtubeMetadata.artist?.replace(
          / /g,
          '\\ '
        )} -metadata title=${youtubeMetadata.title?.replace(/ /g, '\\ ')}`,
      }),
    }).then((output) => console.log(output + '\n'));
  }
}
