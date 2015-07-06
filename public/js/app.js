var TextInput = React.createClass({
  render: function() {
    return (
      <div id="teams">
        <div className="team-1-container">
          <h1 id="team-1">TEAM 1</h1>
          <input id="team-1-edit" maxLength="10"/>
        </div>
        <div className="team-2-container">
          <h1 id="team-2">TEAM 2</h1>
          <input id="team-2-edit" maxLength="10"/>
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    $("#team-1-edit").on("keydown", this.handleKeyDown);
    $("#team-2-edit").on("keydown", this.handleKeyDown);
  },

  componentWillUnMount: function() {
    $("#team-1-edit").off("keydown", this.handleKeyDown);
    $("#team-2-edit").off("keydown", this.handleKeyDown);
  },

  handleKeyDown: function(e) {
    if( e.keyCode == 13 ) {
      this.changeTeam(e);
    }
  },

  changeTeam: function(e) {
    if (e.target.id == "team-1-edit") {
      var team = "team-1";
    } else {
      var team = "team-2";
    }
      $("#" + team).text(e.target.value);
      e.target.value = "";
  }
});

var MapList = React.createClass({
  getInitialState: function() {
    return {
      ban: true,
      turn: 1
    };
  },

  render: function() {
    return (
      <div>
        <div className="maplist">
          <div className="map">de_dust2</div>
          <div className="map">de_inferno</div>
          <div className="map">de_mirage</div>
          <div className="map">de_cache</div>
          <div className="map">de_train</div>
          <div className="map">de_ovepass</div>
          <div className="map">de_cbble</div>
        </div>
        <p>{this.statusChange()}</p>
      </div>
    );
  },

  componentDidMount: function() {
    $(".map").on("click", this.selected);
  },

  componentWillUnMount: function() {
    $(".map").off("click", this.selected);
    $(".banned").off("click", this.selected);
    $(".picked").off("click", this.selected);
  },

  selected: function(element) {
    var map = element.target;
    if (this.props.mapType === "bo3") {
      this.bestOfThree(map);
    } else {
      this.bestOfOne(map);
    }
  },

  bestOfThree: function(map) {
    if (map.className === "map") {
      if (this.state.ban) {
        map.className = "banned";
      } else {
        map.className = "picked";
      }
      this.state.turn = this.state.turn + 1;
      console.log(this.state.ban, this.state.turn);
      if (this.state.turn % 2 != 0) {
        if (this.state.turn === 7) {
          $(".map").attr("class", "picked");
        }
        this.setState({ban: !this.state.ban});
      } else {
        this.forceUpdate();
      }
    }
  },

  bestOfOne: function(map) {
    if (map.className === "map") {
      map.className = "banned";
      this.state.turn = this.state.turn + 1;
      if (this.state.turn === 7) {
          $(".map").attr("class", "picked");
      }
      this.forceUpdate();
    }
  },

  statusChange: function() {
    var status,
        teamName;

    if (this.state.turn === 7) {
      var pickedMapElements = $(".picked");
      var pickedMaps = [];
      pickedMapElements.each(function(idx) {
        pickedMaps.push(pickedMapElements[idx].innerText);
      });
      if (this.props.mapType === "bo3") {
        return "Maps are " + pickedMaps.join(" ");
      } else {
        return "Map is " + pickedMaps;
      }
    } else {
      if (this.state.turn % 2 != 0) {
        teamName = this.props.teamOne; 
      } else {
        teamName = this.props.teamTwo;
      }

      if (this.state.ban) {
        status = "ban";
      } else {
        status = "pick";
      }

      return teamName + "'s turn to " + status;
    }

  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
        <MapList mapType={this.props.mapType} teamOne={this.props.teamOne} teamTwo={this.props.teamTwo}/>
      </div>
    );
  }
});

var MapSelect = React.createClass({
  render: function() {
    return (
      <div>
        <TextInput/>
        <div id="game-select">
          <p>Please Select Type of Game</p>
          <select>
            <option value="bo1">B01</option>
            <option value="bo3">B03</option>
          </select>
          <button onClick={this.submitType}>Submit</button>
        </div>
      </div>
    );
  },

  submitType: function() {
    var mapType = $("select").val();
    React.render(<App mapType={mapType} teamOne={$("#team-1").text()} teamTwo={$("#team-2").text()}/>, document.getElementById("app"));
  }
});

React.render(<MapSelect/>, document.getElementById("app"));