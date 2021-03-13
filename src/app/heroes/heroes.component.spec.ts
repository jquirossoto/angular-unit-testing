import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component";

describe('HeroComponent', () => {

  let component: HeroesComponent;
  let heroes;
  let mockHeroService;

  beforeEach(() => {
    heroes = [
      {id: 1, name: 'Spider Dude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 24},
      {id: 3, name: 'Super Dude', strength: 55}
    ];
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    component = new HeroesComponent(mockHeroService);
  });

  describe('delete', () => {

    it('should remove the indicated hero from the heroes list', () => {
      mockHeroService.deleteHero.and.returnValue(of());
      component.heroes = heroes;
      component.delete(heroes[2]);
      expect(component.heroes.includes(heroes[2])).toBe(false);
    });

    it('should call delete hero with the indicated hero', () => {
      mockHeroService.deleteHero.and.returnValue(of());
      component.heroes = heroes;
      component.delete(heroes[2]);
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroes[2]);
    });

    it('should call subscribe when calling delete hero with the indicated hero', () => {
      const subscribeSpy = jasmine.createSpyObj(['subscribe']);
      mockHeroService.deleteHero.and.returnValue(subscribeSpy);
      component.heroes = heroes;
      component.delete(heroes[2]);
      expect(subscribeSpy.subscribe).toHaveBeenCalled();
    });

  });

});
