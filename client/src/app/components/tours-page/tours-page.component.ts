import { throwError } from 'rxjs';
import { ToursSerivce } from './../../services/tours.service';
import { Component } from '@angular/core';
import { UsersProfile } from 'src/app/services/types/users';
import { UsersService } from 'src/app/services/users.service';
import { RoadsService } from 'src/app/services/roads.service';
import { ToursPageListItem } from './types';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-tours-page',
  templateUrl: './tours-page.component.html',
  styleUrls: ['./tours-page.component.scss']
})
export class ToursPageComponent {

  tours: ToursPageListItem[] | undefined;
  userProfile: UsersProfile | undefined;

  constructor(
    private usersService: UsersService,
    private roadsService: RoadsService,
    private statusService: StatusService,
    private toursSerivce: ToursSerivce
  ) {
    this.usersService.userProfile.subscribe((v) => {
      this.userProfile = v;
    })
  }

  ngOnInit() {
    this.getTours();
  }

  async getTours() {
    try {
      const tours = await this.toursSerivce.findAll();
      const roads = await this.roadsService.findAll();
      const status = await this.statusService.findAll();

      this.tours = tours.map<ToursPageListItem>((tour) => {
        const road = roads.find((road) => road._id === tour.road);
        return {
          maxPeopleCount: tour.maxPeopleCount.toString(),
          description: tour.description,
          participants: tour.participants.length.toString(),
          road: road!, // TODO: check if its not undefined
          status: `${status.find((status) => status._id === tour.status)?.name}`,
        }
      })

    } catch (error) {
      throwError(() => {
        return new Error('Error trying to getTours' + error);
      })
    }
  }
}
