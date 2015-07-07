var TextInput = React.createClass({
  render: function() {
    return (
      <div id="teams">
        <div className="team-1-container">
          <input id="team-1-edit" placeholder="Team 1" maxLength="10"/>
        </div>
        <p id="vs">VS</p>
        <div className="team-2-container">
          <input id="team-2-edit" placeholder="Team 2" maxLength="10"/>
        </div>
      </div>
    );
  }
});

var Map = React.createClass({
  render: function() {
    return (
      <div className="map" style={this.generateStyle(this.props.map)}>
        <p className="map-name">{this.props.map}</p>
      </div>
    )
  },

  generateStyle: function(map) {
    return {
      backgroundImage: "url(../images/" + map + ".jpg)",
      backgroundPosition: "center"
    }
  }
});

var MapList = React.createClass({
  getInitialState: function() {
    return {
      ban: true,
      turn: 1,
      status: null,
      teamName: null
    };
  },

  render: function() {
    return (
      <div id="main">
        <p className="vs-mapview">{this.props.teamOne} vs {this.props.teamTwo}</p>
        <p className="status">{this.statusChange()}</p>
        <div className="maplist">
          {this.maps.map(function(map) {
            return <Map map={map}/>;
          })}
        </div>
        <a id="restart" href="">Restart</a>
      </div>
    );
  },

  maps: ["de_dust2", "de_inferno", "de_mirage", "de_cache", "de_train", "de_overpass", "de_cbble"],

  componentDidMount: function() {
    $(".map").on("click", this.selected);
    $(".map-name").on("click", this.selectedName);
  },

  componentWillUnMount: function() {
    $(".map").off("click", this.selected);
    $(".banned").off("click", this.selected);
    $(".picked").off("click", this.selected);
    $(".map-name").off("click", this.selectedName);
  },

  selectedName: function(element) {
    var parentMap = $(element.target).parent()[0];
    if (this.props.mapType === "bo3") {
      this.bestOfThree(parentMap);
    } else {
      this.bestOfOne(parentMap);
    }
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
        $(map).append("<p class='team-ban'>" + this.state.turn + ". " + this.state.teamName + "</p>");
      } else {
        if (this.state.turn === 3) {
          map.className = "first picked";
        } else if (this.state.turn === 4) {
          map.className = "second picked";
        }
        $(map).append("<p class='team-pick'>" + this.state.turn + ". " + this.state.teamName + "</p>");
      }
      this.state.turn = this.state.turn + 1;
      if (this.state.turn % 2 != 0) {
        if (this.state.turn === 7) {
          $(".map").attr("class", "last picked");
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
      $(map).append("<p class='team-ban'>" + this.state.turn + ". " + this.state.teamName + "</p>");
      this.state.turn = this.state.turn + 1;
      if (this.state.turn === 7) {
          $(".map").attr("class", "picked");
      }
      this.forceUpdate();
    }
  },

  statusChange: function() {
    if (this.state.turn === 7) {
      if (this.props.mapType === "bo3") {
        var firstMap = $(".first.picked")[0].children[0].innerText;
        var secondMap = $(".second.picked")[0].children[0].innerText;
        var lastMap = $(".last.picked")[0].children[0].innerText;
        var maps = [firstMap, secondMap, lastMap];
        return "Maps are " + maps.join(", ");
      } else {
        var pickedMap = $(".picked")[0].children[0].innerText;
        return "Map is " + pickedMap;
      }
    } else {
      if (this.state.turn % 2 != 0) {
        this.state.teamName = this.props.teamOne; 
      } else {
        this.state.teamName = this.props.teamTwo;
      }

      if (this.state.ban) {
        this.state.status = "ban";
      } else {
        this.state.status = "pick";
      }

      return this.state.teamName + "'s turn to " + this.state.status;
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
          <p className="start-details">(Team 1 bans first)</p>
          <select>
            <option value="bo1">BO1</option>
            <option value="bo3">BO3</option>
          </select>
          <button onClick={this.submitType}>Submit</button>
        </div>
      </div>
    );
  },

  getTeam: function(num) {
    var teamEditElement = $("#team-" + num + "-edit");
    if (teamEditElement.val().trim() === "") {
      return "Team " + num;
    } else {
      return teamEditElement.val();
    }
  },

  submitType: function() {
    var mapType = $("select").val();
    React.render(<App mapType={mapType} teamOne={this.getTeam(1)} teamTwo={this.getTeam(2)}/>, document.getElementById("app"));
  }
});

React.render(<MapSelect/>, document.getElementById("app"));