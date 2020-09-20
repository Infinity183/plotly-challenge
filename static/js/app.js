function init() {  
    // We'll reference the select element here.
    var selection = d3.select("#selDataset");
    // We should use the sample names to fill everything out. 
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selection
            .append("option")
            .text(sample)
            .property("value", sample);
            });
        // By default, we'll use the first sample's names.
        var firstSample = sampleNames[0];
        console.log(firstSample);
        // We'll call on the functions that produce the two charts
        // and metadata panel, respectively.
        chartBuilder(firstSample);
        metadataBuilder(firstSample);
    });

};

// This will cause the info to change if the selection is altered.
d3.selectAll("#selDataset").on("change", optionChanged);

// The above statement calls on this function once the dropdown
// selection is changed.
function optionChanged(newSample) {
    var selection = d3.select("#selDataset");
    // We need to define the new set being chosen based on the
    // current selection.
    var newSet = selection.property("value");
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((newSet) => {
            selection
            .append("option")
            .text(newSet)
            .property("value", newSet);
            });
    chartBuilder(newSet);
    metadataBuilder(newSet);
});
};

// We'll need to initialize this dashboard.
init();

// This here will build the bar and bubble charts from the sample data.
function chartBuilder(sample) {

    var dataFile = d3.json("samples.json").then(function(data) {
        var id_list = data.names;

        for (x = 0; x < data.samples.length; x++) {
            // This browses through the samples and sees if the current
            // ID matches the ID in the current sample.
            if (sample === data.samples[x].id) {
                // Since we only want the top 10, we'll slice all of
                // our variables from 0 to 9.
                var otu_ids = data.samples[x].otu_ids.slice(0,9);
                var otu_labels = data.samples[x].otu_labels.slice(0,9);
                // Going to create the OTU ID titles with a for loop.
                otu_id_titles = []
                for (m = 0; m < otu_ids.length; m++) {
                    otu_id_titles.push("OTU " + otu_ids[m]);
                }
                // We define the variables that we'll later use
                // in the trace.
                var frequency = data.samples[x].sample_values.slice(0,9);
                // The bubble graph is not restricted to just the top 10,
                // so we will not slice its IDs and sample values.
                var otu_ids_bubbles = data.samples[x].otu_ids;
                var frequency_bubbles = data.samples[x].sample_values;
                
                // Setting up the bar_trace.
                var bar_trace = {
                    x: frequency,
                    y: otu_id_titles,
                    type: "bar",
                    orientation: 'h',
                    hovertemplate: otu_labels
                };
                
                // Setting up the bubble trace.
                var bubble_trace = {
                    x: otu_ids_bubbles,
                    y: frequency_bubbles,
                    mode: "markers",
                    marker: {
                        size: frequency_bubbles,
                        sizemode: 'area',
                        color: otu_ids_bubbles
                    }
                };   

                var bar_data = [bar_trace];
                var bubble_data = [bubble_trace];
                
                var bar_layout = {
                    title: "OTU Frequency",
                    xaxis: { title: "Frequency" },
                    yaxis: { title: "OTU ID" }
                };
                
                var bubble_layout = {
                    title: "OTU Frequency",
                    xaxis: { title: "OTU ID" },
                    yaxis: { title: "Frequency" }
                };

                Plotly.newPlot("bar", bar_data, bar_layout);
                Plotly.newPlot("bubble", bubble_data, bubble_layout);
            };
        };
    });   
}

// Now we will build the function that adds the Demographic Info.
function metadataBuilder(sample) {

    var dataFile = d3.json("samples.json").then(function(data) {
        var id_list = data.names;

        for (x = 0; x < data.metadata.length; x++) {
            // Again, the ID needs to match.
            if (sample === data.samples[x].id) {
                // Reference the Demographic Info panel.
                var metadata = d3.select("#sample-metadata");
                // Clear the panel before adding the
                // current sample's info.
                metadata.html("");
                // We'll do a forEach loop through all the entries
                // and then add them to the pannel.
                Object.entries(data.metadata[x]).forEach(([key, value]) =>{
                    metadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
                });             
            };
        };
    });
}

function updateMenu() {
    var dropdown = d3.select("#selDataset");
    var current_sample = dropdown.property("value");
}
