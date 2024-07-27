import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return 'Documentation can be found @ <a href="https://documenter.getpostman.com/view/22684334/2sA3kaBJrw">docs</a>';
  }
}
