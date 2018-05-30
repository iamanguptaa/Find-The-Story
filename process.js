
		//Function to process the image using raw image binary format.
    function processImage(binarydata) {

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "3bccf559cdd446698d14e89b725f2510";
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

        // Request parameters.
        var params = {
            "visualFeatures": "Categories,Description,Color,Adult,Tags,ImageType",
            "details": "",
            "language": "en",
        };

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",
            processData: false,
            data: makeblob(binarydata),
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            //alert(JSON.stringify(data, null, 2));             
            //$("#responseTextArea").val(JSON.stringify(data, null, 2));

            var text = JSON.stringify(data.description.captions[0].text, null, 2);
            text = text.replace(/^"(.*)"$/, '$1');
            $("#imageText").append("Image says...<br><br>");
            $("#imageText").append(text);
            $("#imageText").append("<br><br> I found..... <br><br>");

            var x="",y; 
            var x_array=[];
            try{

                for (var i=0 ; i<10; i++)                    //finding the objects in image file
                {
                    y = JSON.stringify(data.tags[i].name, null, 2);
                    y = y.replace(/^"(.*)"$/, '$1');
                    x += y + " , "; 
                    x_array[i] = y; 
                }
            }
            catch(err)
                {
                    console.log("End");
                }
             $("#imageText").append(x); 

        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
    };

    makeblob = function (dataURL) {
            var BASE64_MARKER = ';base64,';
            if (dataURL.indexOf(BASE64_MARKER) == -1) {
                var parts = dataURL.split(',');
                var contentType = parts[0].split(':')[1];
                var raw = decodeURIComponent(parts[1]);
                return new Blob([raw], { type: contentType });
            }
            var parts = dataURL.split(BASE64_MARKER);
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;

            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        }
