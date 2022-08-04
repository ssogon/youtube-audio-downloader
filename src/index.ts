import { program } from 'commander';
import { YoutubeAudioDownloader } from './YoutubeAudioDownloader';
import { YoutubeMetadata } from './YoutubeMetadata';
import { YoutubeMetadataParser } from './YoutubeMetadataParser';

(() => {
  program.argument('<url>').action(process).parse();
})();

async function process(url: string) {
  const youtubeMetadata: YoutubeMetadata | null = await YoutubeMetadataParser.parse(url);
  if (youtubeMetadata) {
    YoutubeAudioDownloader.download(url, youtubeMetadata);
  } else {
    YoutubeAudioDownloader.download(url);
  }
}
