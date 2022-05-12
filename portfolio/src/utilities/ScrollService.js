import { TOTAL_SCREENS } from "./utils";
import {Subject} from 'rxjs';
import {object} from 'prop-types';


export default class ScrollService{
    static ScrollHandler = new ScrollService();
    static currentScreenBroadCaster = new Subject();
    static currentScreenFadeIn = new Subject();

    constructor(){
        window.addEventListener('scroll',this.checkCurrentScreenUnderViewport);
    }

    scrollToHome= () =>{
        let homeScreen = document.getElementById("Home");
        if(!homeScreen){
            return
        }
        else
        {
            homeScreen.scrollIntoView({behavior:"smooth"})
        }
    }

    isElementInView = (ele,type) =>{
        let rec = ele.getBoundingClientRect();
        let elementTop = rec.top;
        let elementBottom = rec.bottom;
        let partiallyVisible = elementTop< window.innerHeight && elementBottom>=0;
        let completelyVisible = elementTop>= 0 && elementBottom<= window.innerHeight;
        switch(type)
        {
            case "partial":
                return partiallyVisible;

            case "complete":
                return completelyVisible;

            default:
                return false;
        }
    }

    checkCurrentScreenUnderViewport = (event) =>{
        if(!event || object.keys(event).length<1)
        {
            return
        }
        for(let screen of TOTAL_SCREENS)
        {
            let screenFromDOM = document.getElementById(screen.screen_name)
            if(!screenFromDOM)
            {
                continue;
            }

            let fullyVisible = this.isElementInView(screenFromDOM,"complete")
            let partiallyVisible = this.isElementInView(screenFromDOM,"partial")

            if (fullyVisible || partiallyVisible)
            {
                if(partiallyVisible && !screen.alreadyRendered)
                {
                    ScrollService.currentScreenFadeIn.next({
                        fadeInScreen: screen.screen_name
                    });
                    screen['alreadyRendered'] = true;
                    break;
                }
                if(fullyVisible)
                {
                    ScrollService.currentScreenBroadCaster.next({
                        screenInView: screen.screen_name
                    });
                    break;
                }
            }

        }
    }

}