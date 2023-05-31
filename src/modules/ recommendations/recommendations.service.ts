import { Injectable } from '@nestjs/common';
import { Repositories } from '../../models/db.repositories';
import { User } from '../../models/user/user.schema';
import * as _ from 'lodash';

@Injectable()
export class RecommendationsService {
  constructor(private readonly repositories: Repositories) {}

  async getRecommendations(
    user: User,
    limitLastListensTracks = 7,
    limitGenres = 2,
    limitArtists = 5,
    limitListens = 100,
  ) {
    const recentListenedTracks = await this.repositories.listen.findMany(
      {
        userId: user?.id,
      },
      { limit: limitListens, sort: { listenedDate: -1 } },
    );

    const listenStatistics = recentListenedTracks.reduce(
      (prev, listen) => {
        const genre = listen.track.genre;
        const artist = listen.track.userId.toString();

        if (prev.genres[genre]) {
          prev.genres[genre] += 1;
        } else {
          prev.genres[genre] = 1;
        }

        if (prev.artists[artist]) {
          prev.artists[artist] += 1;
        } else {
          prev.artists[artist] = 1;
        }

        return prev;
      },
      { genres: {}, artists: {} },
    );

    const lastListensTracks = _.uniqBy(
      recentListenedTracks,
      (track) => `${track.trackId}`,
    );

    const topGenres = Object.entries(listenStatistics.genres)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, limitGenres)
      .map((pair) => pair[0]);

    const topArtists = Object.entries(listenStatistics.genres)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, limitArtists)
      .map((pair) => pair[0]);

    return { lastListensTracks, topGenres, topArtists };
  }

  async getRecentListenedTracks(user: User, limitLastListensTracks = 7) {
    const recentListenedTracks = await this.repositories.listen.findMany(
      {
        userId: user?.id,
      },
      { limit: limitLastListensTracks, sort: { listenedDate: -1 } },
    );

    return _.uniqBy(recentListenedTracks, (track) => `${track.trackId}`).map(
      (listen) => listen.track,
    );
  }
}
