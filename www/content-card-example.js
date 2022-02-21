

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS("https://fonts.googleapis.com/css?family=Gloria+Hallelujah");

window.clickManager = {
};
class ContentCardExample extends HTMLElement {
  _hass;
  _config;

  handleToogleClick(event) {
    
    const index = Number(event.target.getAttribute("index"));
    const buttonId = this._config.entities[index].button;
    const buttonRelayId = this._config.entities[index].button_relay;
    this._hass.callService("homeassistant", "toggle", {
      entity_id: buttonId
    });

    this._hass.callService("homeassistant", "toggle", {
      entity_id: buttonRelayId
    });
  }


  constructor() {
    super();

    this.handleToogleClick = this.handleToogleClick.bind(this);
    clickManager.click = this.handleToogleClick;
  }
    set hass(hass) {
      this._hass = hass;
      console.log('has',hass);
      // Initialize the content if it's not there yet.
      if (!this.content) {
        this.innerHTML = `
          <ha-card header="Опалення">
          <style>
          .card-content {
            display:grid;
            grid-template-columns: 1fr 1fr 1fr;
          }
          .custom-card {
            border: 1px  dotted gray;
            min-width:100px;
            margin:4px;
            padding:2px;
          }
          .custom-card ha-state-icon{
           cursor:pointer;
          }
       
          .custom-card ha-state-icon.active {
            color:gold;
          }
          </style>
            <div class="card-content"></div>
          </ha-card>
        `;
        this.content = this.querySelector('div');
      }


      this.content.innerHTML = this._config.entities.map((entity,index) => {
        const buttonId = entity.button;
        const buttonRelayId = entity.button_relay;
        const temperatureId = entity.temperature;

        const buttonState = hass.states[buttonId];
        const buttonRelayState = hass.states[buttonRelayId];
        const temperatureState = hass.states[temperatureId];

        return `<div class="custom-card"> 
                <div> 
                  <ha-state-icon class="${buttonState.state === 'on' ? 'active' : ''}" index=${index} onclick="clickManager.click(event)" icon=${buttonState.attributes.icon} data-state="${buttonState.state}"></ha-state-icon>
                  <ha-state-icon class="${buttonRelayState.state === 'on' ? 'active' : ''}" index=${index} onclick="clickManager.click(event)" icon=${buttonState.attributes.icon} data-state="${buttonRelayState.state}"></ha-state-icon>
                </div>
          <h3>  
               
                
          ${entity.entity}</h3>
        
           <div>${temperatureState.state}</div>

        </div>`

      }).join('')
    
    }
  


    connectedCallback() {
      console.log('connectedCallback.');
    }

    disconnectedCallback() {
      console.log('disconnectedCallback.');
    }

    // The user supplied configuration. Throw an exception and Lovelace will
    // render an error card.
    setConfig(config) {
      console.log('config',config);
      if (!config.entities) {
        throw new Error('You need to define an entities');
      }
     
      this._config = config;
    }
  
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define('content-card-example', ContentCardExample);