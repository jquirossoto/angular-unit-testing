import { Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent (deep tests)', () => {

  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let heroes;

  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    heroes = [
      { id: 1, name: 'Spider Dude', strength: 8 },
      { id: 2, name: 'Wonderful Woman', strength: 24 },
      { id: 3, name: 'Super Dude', strength: 55 }
    ];
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectStub
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      // schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as hero component', () => {
    mockHeroService.getHeroes.and.returnValue(of(heroes));
    fixture.detectChanges();
    let renderedHeroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(renderedHeroComponents.length).toBe(heroes.length);
    for (let i=0; i < renderedHeroComponents.length; i++) {
      expect(renderedHeroComponents[i].componentInstance.hero).toBe(heroes[i]);
    }
  });

  it('should call heroService.deleteHero when the HeroComponent delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.and.returnValue(of(heroes));
    fixture.detectChanges();
    let renderedHeroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    // click the delete button that will emit the event
    // if the child component has sufficient testing then its maybe unnecesary to test it again going thru the template
    // renderedHeroComponents[1].query(By.css('button')).triggerEventHandler('click', {stopPropagation: () => {}});
    // renderedHeroComponents[1].triggerEventHandler('delete', null);
    // expect(fixture.componentInstance.delete).toHaveBeenCalledWith(heroes[1]);

    // simply emit the event
    // if the child component has sufficient test then its only necessary to test the binds between the parent and child component
    (<HeroComponent>renderedHeroComponents[0].componentInstance).delete.emit(undefined);
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(heroes[0]);
  });

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(heroes));
    fixture.detectChanges();
    const name = 'Mr. Ice';
    mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];
    input.value = name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ul')).nativeElement.textContent).toContain(name);
  });

  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(heroes));
    fixture.detectChanges();
    let renderedHeroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    let routerLink = renderedHeroComponents[0].query(By.directive(RouterLinkDirectStub)).injector.get(RouterLinkDirectStub);
    renderedHeroComponents[0].query(By.css('a')).triggerEventHandler('click', null);
    expect(routerLink.navigatedTo).toBe('/detail/1');
  });


});
