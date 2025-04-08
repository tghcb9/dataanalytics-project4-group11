// call Flask API endpoint
function predictions() {
    var name = $("#name").val();
    var platform = $("#platform").val();
    var Year = parseInt($("#Year").val());
    var Genre = $("#Genre").val();
    var Publisher = $("#Publisher").val();
    var NA = parseFloat($("#NA").val());
    var EU = parseFloat($("#EU").val());
    var JP = parseFloat($("#JP").val());
    var Other = parseFloat($("#Other").val());
    var Global = parseFloat($("#Global").val());
    var Critic_Score = parseFloat($("#Critic_Score").val());
    var Critic_Count = parseFloat($("#Critic_Count").val());
    var User_Score = parseFloat($("#User_Score").val());
    var Developer = $("#Developer").val();
    var Rating = $("#Rating").val();

  // create the payload
  var payload = {
    "name": name,
    "platform": platform,
    "Year": Year,
    "Genre": Genre,
    "Publisher": Publisher,
    "NA": NA,
    "EU": EU,
    "JP": JP,
    "Other": Other,
    "Global": Global,
    "Critic_Score": Critic_Score,
    "Critic_Count": Critic_Count,
    "User_Score": User_Score,
    "Developer": Developer,
    "Rating": Rating
  };

  // Perform a POST request to the query URL
  $.ajax({
      type: "POST",
      url: "/predictions",
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify({ "data": payload }),
      success: function(returnedData) {
          // print it for debugging
          console.log(returnedData);
          var prob = parseFloat(returnedData["prediction"]);

          if (prob > 0.5) {
              $("#output").text(`The passenger is likely to be satisfied with the flight with a satisfaction rating of ${(prob * 100).toFixed(2)}%!!`);
          } else {
              $("#output").text(`Unfortunately, the passenger is unlikely to be satisfied with the flight with a satisfaction rating of ${(prob * 100).toFixed(2)}%!.`);
          }

          // Call buildDonut function
          buildDonut(prob)

      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("Status: " + textStatus);
          alert("Error: " + errorThrown);
      }
  });

}


function buildDonut(prob) {
  // Data
  var satis = prob;
  var unsatis = 1 - prob;

  var data = [{
      values: [satis, unsatis],
      labels: ['Satisfied', 'Unsatisfied or Neutral'],
      hole: .5,
      marker: {
          colors: ['#45CAFF', '#FF1B6B']
        },
      textinfo: "label+percent",
      type: 'pie'
  }];
  
  var layout = {
      annotations: [{
          font: { size: 30 },
          showarrow: false,
          text: 'Satisfaction',
          x: 0.5,
          y: 0.5
      }],
      height: 800,
      width: 1200,
      showlegend: false
  };
  
  Plotly.newPlot('donut', data, layout);  
};