function JSAccordion(elementOrSelector) {
    if(!(this instanceof JSAccordion))
        return new JSAccordion(elementOrSelector);

    //  define private properties
    _clickTimeout = {};

    //  define public methods
    this.init = function() {
        var lists, listItems, i, j, header, headerHx, body;
        //  add jsac unique id to container element as new attribute
        this.targetElement.setAttribute('data-jsac-id', this.id);
        this.targetElement.classList.add('jsac-container');
        //  get all first level ul of continer
        lists = document.querySelectorAll("[data-jsac-id=\""+this.id+"\"] > ul");

        for(i = 0; i < lists.length; i ++) {
            lists[i].classList.add('jsac-list');
            listItems = lists[i].querySelectorAll("[data-jsac-id=\""+this.id+"\"] > ul > li");
            for(j = 0; j < listItems.length; j ++) {
                listItems[j].classList.add('jsac-list-item');

                body = listItems[j].querySelector("div:nth-child(2)");
                body.style.height = body.offsetHeight+ 'px';
                body.classList.add('jsac-body');

                header = listItems[j].querySelector("div:nth-child(1)");
                header.classList.add('jsac-header');
                header.onclick = (function() {
                    var listItem = listItems[j], bodyElement = body, that = this, target = [i,j];
                    return function (event) {
                        if(listItem.classList.contains('collapsed')) {
                            listItem.classList.add('expanded');
                            listItem.classList.remove('collapsed');
                        } else {
                            listItem.classList.remove('expanded');
                            listItem.classList.add('collapsed');
                        }

                        if(that._clickTimeout[target[0]+'-'+[target[1]]] != undefined)
                            clearTimeout(that._clickTimeout[target[0]+'-'+[target[1]]]);

                        that._clickTimeout[target[0]+'-'+[target[1]]] = setTimeout(function() {
                            if (listItem.classList.contains('expanded')) {
                                var oldHeight = bodyElement.style.height;
                                bodyElement.style.height = 'auto';
                                var newHeight = bodyElement.offsetHeight + 'px';
                                bodyElement.style.height = oldHeight;
                                bodyElement.style.height = newHeight;
                            }

                            delete _clickTimeout[target[0]+'-'+[target[1]]];
                        }, 500);
                    }
                })();

                headerHx = header.querySelector('h3,h4,h5,h6');
                headerHx.classList.add('jsac-title');
            }
        }
        
        return this;
    };

    //  start construction operations
    //  if parameter is element selector
    if(typeof elementOrSelector == 'string') {
        this.targetElement = document.querySelector(elementOrSelector);
        if(this.targetElement == null) {
            throw ('invalid element selector');
        }
    }
    //  if parameter is element DOM object
    else if(typeof elementOrSelector == 'object')
        this.targetElement = elementOrSelector;
    else
        throw ('Unknown element type');

    //  set autoincrement instance id to object
    this.id = JSAccordion.instances.length;

    JSAccordion.instances.push(this);

    this.init();

    return this;
}

//  define static property to keep all instances
JSAccordion.instances = [];
