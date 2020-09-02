class ThreeSixtyJS {
    protected identifier: string;
    private readonly settings: ThreeSixtyJSSettings;
    private readonly listener: ThreeSixtyJSListener;

    private view: Element;
    private amount: number;
    private srcSchema: string;

    private touchPosition: number;
    private mousePosition: number;
    private mouseEnabled: boolean = false;

    private wheelData: number = 0;
    private currentWheelData: number = 0;

    constructor (
        identifier: string,
        settings: ThreeSixtyJSSettings = null,
        listener: ThreeSixtyJSListener = null
    ) {
        this.identifier = identifier;
        this.settings = {
            intensity: 25,
            parameters: {
                amount: 'data-amount',
                src: 'data-src',
                current: 'data-current'
            },
            placeholder: '{}',
            style: 'display: none; width: 100%; height: 100%;'
        };
        Object.assign(this.settings, settings);

        this.listener = {
            prev: null,
            next: null,
            update: null
        };
        Object.assign(this.listener, listener);

        this.initEventListener();
        this.createVariables();
        this.createImageContainers();
        this.makeContainerVisibleById(0);

        this.mouse();
        this.touch();
        this.wheel();
    }

    public nextImage = (): void => {
        let id: number = this.getCurrentImageId();

        id++;

        if (id >= this.getAmount()) {
            id = 0;
        }

        this.makeContainerVisibleById(id);
    };

    public prevImage = (): void => {
        let id: number = this.getCurrentImageId();

        id--;

        if (id < 0) {
            id = this.getAmount() - 1;
        }

        this.makeContainerVisibleById(id);
    };

    private initEventListener = (): void => {
        for (let i = 0; i < this.listener.next.length; i++) {
            let elements = document.querySelectorAll(this.listener.next[i]);
            for (let j = 0; j < elements.length; j++) {
                elements[j].addEventListener(
                    'click',
                    this.nextImage,
                    {
                        passive: true
                    }
                );
            }
        }

        for (let i = 0; i < this.listener.prev.length; i++) {
            let elements = document.querySelectorAll(this.listener.prev[i]);
            for (let j = 0; j < elements.length; j++) {
                elements[j].addEventListener(
                    'click',
                    this.prevImage,
                    {
                        passive: true
                    }
                );
            }
        }
    };

    private touch = (): void => {
        this.getView().addEventListener(
            'touchstart',
            this.enableTouch,
            {
                passive: true
            }
        );

        this.getView().addEventListener(
            'touchmove',
            this.moveTouch,
            {
                passive: true
            }
        );
    };

    private wheel = (): void => {
        this.getView().addEventListener(
            'wheel',
            this.moveWheel,
            {
                passive: true
            }
        );
    };

    private mouse = (): void => {
        this.getView().addEventListener(
            'mousedown',
            this.enableMouse
        );
        this.getView().addEventListener(
            'mouseup',
            this.disableMouse
        );
        this.getView().addEventListener(
            'mouseleave',
            this.disableMouse
        );
        this.getView().addEventListener(
            'mousemove',
            this.moveMouse
        );
    };

    private moveWheel = (event: WheelEvent): void => {
        if (this.wheelData === 0) {
            this.wheelData = event.deltaX;
        }

        this.currentWheelData = this.currentWheelData + event.deltaX;

        if (this.wheelData + this.settings.intensity < this.currentWheelData) {
            this.wheelData = this.currentWheelData;
            this.nextImage();
        } else if (this.wheelData - this.settings.intensity > this.currentWheelData) {
            this.wheelData = this.currentWheelData;
            this.prevImage();
        }
    };

    private enableTouch = (event: TouchEvent): void => {
        this.touchPosition = event.touches[0].clientX;
    };

    private moveTouch = (event: TouchEvent): void => {
        let currentTouchPosition: number = event.touches[0].clientX;

        if (this.touchPosition + this.settings.intensity < currentTouchPosition) {
            this.touchPosition = currentTouchPosition;
            this.prevImage();
        } else if (this.touchPosition - this.settings.intensity > currentTouchPosition) {
            this.touchPosition = currentTouchPosition;
            this.nextImage();
        }
    };

    private enableMouse = (event: MouseEvent): void => {
        event.preventDefault();
        this.mouseEnabled = true;
        this.mousePosition = event.clientX;
    };

    private disableMouse = (event: MouseEvent): void => {
        this.mouseEnabled = false;
    };

    private moveMouse = (event: MouseEvent): void => {
        if (this.mouseEnabled === false) {
            return;
        }

        let currentMousePosition: number = event.clientX;

        if (this.mousePosition + this.settings.intensity < currentMousePosition) {
            this.mousePosition = currentMousePosition;
            this.prevImage();
        } else if (this.mousePosition - this.settings.intensity > currentMousePosition) {
            this.mousePosition = currentMousePosition;
            this.nextImage();
        }
    };

    private updateFunction = (): void => {
        for(let i = 0; i < this.listener.update.length; i++) {
            this.listener.update[i](this.getCurrentImageId(), this.getAmount());
        }
    };

    private makeContainerVisibleById = (id: number): void => {
        let childes: NodeListOf<HTMLElement> = this.getView().querySelectorAll('*');

        for (let i: number = 0; i < this.getAmount(); i++) {
            childes[i].style.display = 'none';
        }

        childes[id].style.display = '';
        this.getView().setAttribute(this.settings.parameters.current, String(id));
        this.updateFunction();
    };

    private createImageContainers = (): void => {
        for (let i: number = 0; i < this.getAmount(); i++) {
            let element: Element = document.createElement('img');
            element.setAttribute('style', this.settings.style);
            element.setAttribute('src', this.buildUrl(i));

            this.getView().appendChild(element);
        }
    };

    private createVariables = (): void => {
        this.view = document.querySelector(this.identifier);
        this.amount = Number(this.getView().getAttribute(this.settings.parameters.amount));
        this.srcSchema = String(this.getView().getAttribute(this.settings.parameters.src));
    };

    private buildUrl = (id: number): string => {
        return this.getSrcSchema().replace(this.settings.placeholder, String(id));
    };

    private getCurrentImageId = (): number => {
        return Number(this.getView().getAttribute(this.settings.parameters.current));
    };

    private getSrcSchema = (): string => {
        return this.srcSchema;
    };

    private getAmount = (): number => {
        return this.amount;
    };

    private getView = (): Element => {
        return this.view;
    };
}

interface ThreeSixtyJSListener {
    next: string | string[],
    prev: string | string[],
    update: any
}

interface ThreeSixtyJSSettings {
    intensity: number,
    parameters: {
        amount: string,
        src: string,
        current: string
    },
    placeholder: string,
    style: string
}
