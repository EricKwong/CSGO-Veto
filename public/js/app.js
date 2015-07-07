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
      <div>
        <p className="status">{this.statusChange()}</p>
        <div className="maplist">
          {this.maps.map(function(map) {
            return <Map map={map}/>;
          })}
        </div>
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
      // var pickedMapElements = $(".picked");
      // var pickedMaps = [];
      // pickedMapElements.each(function(idx) {
      //   var pickedMap = $(pickedMapElements[idx]).children(".map-name")[0].innerText;
      //   pickedMaps.push(pickedMap);
      // });
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

  submitType: function() {
    var mapType = $("select").val();
    React.render(<App mapType={mapType} teamOne={$("#team-1").text()} teamTwo={$("#team-2").text()}/>, document.getElementById("app"));
  }
});

React.render(<MapSelect/>, document.getElementById("app"));