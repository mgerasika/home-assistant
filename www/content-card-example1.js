

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

  handleLampClick(event) {
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

  handleNightPlusClick(event) {
    const index = Number(event.target.getAttribute("index"));
    const input_numberId = this._config.entities[index].night_temperature;
    this._hass.callService( 'input_number','increment',     {
      entity_id: input_numberId,
    });
  }

  handleNightMinusClick(event) {
    const index = Number(event.target.getAttribute("index"));
    const input_numberId = this._config.entities[index].night_temperature;
    this._hass.callService("input_number", "decrement", {
      entity_id: input_numberId,
    });

  

   
  }

  handleDayPlusClick(event) {
    const index = Number(event.target.getAttribute("index"));
    const input_numberId = this._config.entities[index].day_temperature;
    this._hass.callService( 'input_number','increment',     {
      entity_id: input_numberId,
    });
  }

  handleDayMinusClick(event) {
    const index = Number(event.target.getAttribute("index"));
    const input_numberId = this._config.entities[index].day_temperature;
    this._hass.callService("input_number", "decrement", {
      entity_id: input_numberId,
    });
  }

  constructor() {
    super();

    this.handleLampClick = this.handleLampClick.bind(this);
    this.handleNightPlusClick = this.handleNightPlusClick.bind(this);
    this.handleNightMinusClick = this.handleNightMinusClick.bind(this);
    this.handleDayPlusClick = this.handleDayPlusClick.bind(this);
    this.handleDayMinusClick = this.handleDayMinusClick.bind(this);

    clickManager.lampClick = this.handleLampClick;
    clickManager.nightPlusClick = this.handleNightPlusClick;
    clickManager.nightMinusClick = this.handleNightMinusClick;


    clickManager.dayPlusClick = this.handleDayPlusClick;
    clickManager.dayMinusClick = this.handleDayMinusClick;

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
        const night_temperatureId = entity.night_temperature;
        const day_temperatureId = entity.day_temperature;

        const buttonState = hass.states[buttonId];
        const buttonRelayState = hass.states[buttonRelayId];
        const temperatureState = hass.states[temperatureId];
        const nightTemperatureState = hass.states[night_temperatureId];
        const dayTmperatureState = hass.states[day_temperatureId] || {};

        return `<div class="custom-card"> 
                  <div style="display:flex;justify-content:space-between;"> 
                    <div >
                      <ha-state-icon class="${buttonState.state === 'on' ? 'active' : ''}" index=${index} onclick="clickManager.lampClick(event)" icon=${buttonState.attributes.icon} data-state="${buttonState.state}"></ha-state-icon>
                      <ha-state-icon class="${buttonRelayState.state === 'on' ? 'active' : ''}" index=${index} onclick="clickManager.lampClick(event)" icon=${buttonState.attributes.icon} data-state="${buttonRelayState.state}"></ha-state-icon>
                    </div>
                    <div>
                      <button style="font-size:20px;" onclick="clickManager.nightPlusClick(event)">+</button>
                     <span> ${nightTemperatureState.state}</span>
                      <button style="font-size:20px;" onclick="clickManager.nightMinusClick(event)">-</button>
                    </div>
                  </div>

                <div style="display:flex;justify-content:space-between;"> 
                  <h3>${entity.entity}</h3>
                  <div>
                    <button style="font-size:20px;" onclick="clickManager.dayPlusClick(event)">+</button>
                    <span> ${dayTmperatureState.state} </span>
                    <button style="font-size:20px;" onclick="clickManager.dayMinusClick(event)">-</button>
                  </div>
                </div>
                <div style="font-size:14px;display:flex;justify-content:space-between;">
                    <span style="font-weight:bold;">${temperatureState.state}</span> 
                </div>

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