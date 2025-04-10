// Sample genres/platforms/rating lists
const genres = ["Action", "Adventure", "Fighting", "Misc", "Platform", "Puzzle", "Racing", "Role-Playing", "Shooter", "Simulation", "Sports", "Strategy"];
const platforms = ["3DS", "DC", "DS", "GBA", "GC", "PC", "PS", "PS2", "PS3", "PS4", "PSP", "PSV", "Wii", "WiiU", "X360", "XB", "XOne"];
const ratings = ["AO", "E", "E10+", "K-A", "M", "RP", "T", "Unknown"];

// Call Flask API endpoint when button is clicked
$(document).ready(function () {
    $("#filter").click(function () {
      predictions();
    });
});
  
function predictions() {
    let payload = {};
  
    // Get selected dropdown values for genre, platform, and rating
    const selectedGenre = $("#GenreSelect").val();
    const selectedPlatform = $("#PlatformSelect").val();
    const selectedRating = $("#RatingSelect").val();
  
    // Set the selected options to true in the payload
    payload[selectedGenre] = true;
    payload[selectedPlatform] = true;
    payload[selectedRating] = true;
  
    // Add numeric inputs from form
    payload["Publisher"] = parseInt($("#PublisherSelect").val());
    payload["Year of Release"] = parseInt($("#Year").val());
    payload["Critic Score"] = parseFloat($("#Critic_Score").val());
    payload["User Score"] = parseFloat($("#User_Score").val());
  
    // Regional priorities (simulate as proxy sales weight)
    payload["NA Sales"] = parseFloat($("#NA_Sales").val());
    payload["EU Sales"] = parseFloat($("#EU_Sales").val());
    payload["JP Sales"] = parseFloat($("#JP_Sales").val());
    payload["Other Sales"] = parseFloat($("#Other_Sales").val());
  
    // POST request to Flask backend
    $.ajax({
      type: "POST",
      url: "/predictions",
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify({ data: payload }),
      success: function (returnedData) {
        const sales = parseFloat(returnedData["prediction"]);
        $("#output").text(`Estimated global sales: ${sales.toFixed(2)} million units`);
        buildSalesBar(sales);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus);
        alert("Error: " + errorThrown);
      }
    });
}

let chartInstance = null;
  
function buildSalesBar(sales) {
    const ctx = document.getElementById("salesChart").getContext("2d");
  
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Global Sales (millions)"],
        datasets: [{
          data: [sales],
          backgroundColor: getColorForSales(sales),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            min: 0,
            max: 5, // Adjust depending on your dataset scale
            title: {
              display: true,
              text: "Million Units Sold"
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.raw.toFixed(2)} million units`;
              }
            }
          }
        }
      }
    });
  }
  
  // Helper function to pick bar color
  function getColorForSales(sales) {
    if (sales < .5) return "#e74c3c";    // Red
    if (sales < 1) return "#f39c12";    // Orange
    if (sales < 1.5) return "#f1c40f";    // Yellow
    if (sales < 2) return "#2ecc71";    // Light Green
    return "#27ae60";                    // Dark Green
  }