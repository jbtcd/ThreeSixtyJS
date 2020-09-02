class ThreeSixtyJS {
    constructor(identifier, settings = null, listener = null) {
        this.mouseEnabled = false;
        this.wheelData = 0;
        this.currentWheelData = 0;
        this.nextImage = () => {
            let id = this.getCurrentImageId();
            id++;
            if (id >= this.getAmount()) {
                id = 0;
            }
            this.makeContainerVisibleById(id);
        };
        this.prevImage = () => {
            let id = this.getCurrentImageId();
            id--;
            if (id < 0) {
                id = this.getAmount() - 1;
            }
            this.makeContainerVisibleById(id);
        };
        this.initEventListener = () => {
            for (let i = 0; i < this.listener.next.length; i++) {
                let elements = document.querySelectorAll(this.listener.next[i]);
                for (let j = 0; j < elements.length; j++) {
                    elements[j].addEventListener('click', this.nextImage, {
                        passive: true
                    });
                }
            }
            for (let i = 0; i < this.listener.prev.length; i++) {
                let elements = document.querySelectorAll(this.listener.prev[i]);
                for (let j = 0; j < elements.length; j++) {
                    elements[j].addEventListener('click', this.prevImage, {
                        passive: true
                    });
                }
            }
        };
        this.touch = () => {
            this.getView().addEventListener('touchstart', this.enableTouch, {
                passive: true
            });
            this.getView().addEventListener('touchmove', this.moveTouch, {
                passive: true
            });
        };
        this.wheel = () => {
            this.getView().addEventListener('wheel', this.moveWheel, {
                passive: true
            });
        };
        this.mouse = () => {
            this.getView().addEventListener('mousedown', this.enableMouse);
            this.getView().addEventListener('mouseup', this.disableMouse);
            this.getView().addEventListener('mouseleave', this.disableMouse);
            this.getView().addEventListener('mousemove', this.moveMouse);
        };
        this.moveWheel = (event) => {
            if (this.wheelData === 0) {
                this.wheelData = event.deltaX;
            }
            this.currentWheelData = this.currentWheelData + event.deltaX;
            if (this.wheelData + this.settings.intensity < this.currentWheelData) {
                this.wheelData = this.currentWheelData;
                this.nextImage();
            }
            else if (this.wheelData - this.settings.intensity > this.currentWheelData) {
                this.wheelData = this.currentWheelData;
                this.prevImage();
            }
        };
        this.enableTouch = (event) => {
            this.touchPosition = event.touches[0].clientX;
        };
        this.moveTouch = (event) => {
            let currentTouchPosition = event.touches[0].clientX;
            if (this.touchPosition + this.settings.intensity < currentTouchPosition) {
                this.touchPosition = currentTouchPosition;
                this.prevImage();
            }
            else if (this.touchPosition - this.settings.intensity > currentTouchPosition) {
                this.touchPosition = currentTouchPosition;
                this.nextImage();
            }
        };
        this.enableMouse = (event) => {
            event.preventDefault();
            this.mouseEnabled = true;
            this.mousePosition = event.clientX;
        };
        this.disableMouse = (event) => {
            this.mouseEnabled = false;
        };
        this.moveMouse = (event) => {
            if (this.mouseEnabled === false) {
                return;
            }
            let currentMousePosition = event.clientX;
            if (this.mousePosition + this.settings.intensity < currentMousePosition) {
                this.mousePosition = currentMousePosition;
                this.prevImage();
            }
            else if (this.mousePosition - this.settings.intensity > currentMousePosition) {
                this.mousePosition = currentMousePosition;
                this.nextImage();
            }
        };
        this.updateFunction = () => {
            for (let i = 0; i < this.listener.update.length; i++) {
                this.listener.update[i](this.getCurrentImageId(), this.getAmount());
            }
        };
        this.makeContainerVisibleById = (id) => {
            let childes = this.getView().querySelectorAll('*');
            for (let i = 0; i < this.getAmount(); i++) {
                childes[i].style.display = 'none';
            }
            childes[id].style.display = '';
            this.getView().setAttribute(this.settings.parameters.current, String(id));
            this.updateFunction();
        };
        this.createImageContainers = () => {
            for (let i = 0; i < this.getAmount(); i++) {
                let element = document.createElement('img');
                element.setAttribute('style', this.settings.style);
                element.setAttribute('src', this.buildUrl(i));
                this.getView().appendChild(element);
            }
        };
        this.createVariables = () => {
            this.view = document.querySelector(this.identifier);
            this.amount = Number(this.getView().getAttribute(this.settings.parameters.amount));
            this.srcSchema = String(this.getView().getAttribute(this.settings.parameters.src));
        };
        this.buildUrl = (id) => {
            return this.getSrcSchema().replace(this.settings.placeholder, String(id));
        };
        this.getCurrentImageId = () => {
            return Number(this.getView().getAttribute(this.settings.parameters.current));
        };
        this.getSrcSchema = () => {
            return this.srcSchema;
        };
        this.getAmount = () => {
            return this.amount;
        };
        this.getView = () => {
            return this.view;
        };
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
}
