if (app.documents.length === 0) {
  alert("Er is geen document geopend.");
} else {

  if (app.selection.length === 0 || !(app.selection[0].fillColor)) {
    alert("Selecteer een shape of tekstblok met een vullingkleur.");
  } else {
    var selectedElement = app.selection[0];
    var selectedColor = selectedElement.fillColor;

    if (selectedColor.space !== ColorSpace.CMYK && selectedColor.space !== ColorSpace.RGB) {
      alert("Het geselecteerde element heeft geen geldige kleur. Kies een element met een vullingkleur en probeer het opnieuw.");
    } else {
      var colorPalette = generateColorPalette(selectedColor);

      var doc = app.activeDocument;
      var xPos = selectedElement.geometricBounds[1];
      var yPos = selectedElement.geometricBounds[2] + 2;

      for (var i = 0; i < colorPalette.length; i++) {
        var color = colorPalette[i];
        var rect = doc.pages[0].rectangles.add({
          geometricBounds: [yPos, xPos, yPos + 10, xPos + 10], // 10mm x 10mm blokje
          fillColor: color,
        });

        xPos += 12;
      }
    }
  }
}

function generateColorPalette(color) {
  var palette = [];

  var lightestColor = color;
  var lighterColor = color;
  var darkestColor = color;
  var darkerColor = color;

  if (color.space === ColorSpace.CMYK) {
    var cmykValues = color.colorValue;
    var lightestCyan = Math.max(cmykValues[0] - 25, 0); // (25% cyaan verminderen)
    var lighterCyan = Math.max(cmykValues[0] - 50, 0); // (50% cyaan verminderen)
    var darkestBlack = Math.min(cmykValues[3] + 25, 100); // (25% zwart toevoegen)
    var darkerBlack = Math.min(cmykValues[3] + 50, 100); // (50% zwart toevoegen)

    lightestColor = app.documents[0].colors.add({
      space: ColorSpace.CMYK,
      colorValue: [lightestCyan, cmykValues[1], cmykValues[2], cmykValues[3]],
    });
    lighterColor = app.documents[0].colors.add({
      space: ColorSpace.CMYK,
      colorValue: [lighterCyan, cmykValues[1], cmykValues[2], cmykValues[3]],
    });


    if (lightestColor.space === lighterColor.space && lightestColor.colorValue.toString() === lighterColor.colorValue.toString()) {
      lighterCyan = Math.max(lightestCyan - 50, 0);
      lighterColor = app.documents[0].colors.add({
        space: ColorSpace.CMYK,
        colorValue: [lighterCyan, cmykValues[1], cmykValues[2], cmykValues[3]],
      });
    }

    darkestColor = app.documents[0].colors.add({
      space: ColorSpace.CMYK,
      colorValue: [cmykValues[0], cmykValues[1], cmykValues[2], darkestBlack],
    });
    darkerColor = app.documents[0].colors.add({
      space: ColorSpace.CMYK,
      colorValue: [cmykValues[0], cmykValues[1], cmykValues[2], darkerBlack],
    });
  }

  else if (color.space === ColorSpace.RGB) {
    var rgbValues = color.colorValue;
    var lightestBlue = Math.min(rgbValues[2] + 64, 255); // (25% blauw toevoegen)
    var lighterBlue = Math.min(rgbValues[2] + 128, 255); // (50% blauw toevoegen)
    var darkestBlue = Math.max(rgbValues[2] - 64, 0); // (25% blauw verminderen)
    var darkerBlue = Math.max(rgbValues[2] - 128, 0); // (50% blauw verminderen)

    lightestColor = app.documents[0].colors.add({
      space: ColorSpace.RGB,
      colorValue: [rgbValues[0], rgbValues[1], lightestBlue],
    });
    lighterColor = app.documents[0].colors.add({
      space: ColorSpace.RGB,
      colorValue: [rgbValues[0], rgbValues[1], lighterBlue],
    });

    if (lightestColor.space === lighterColor.space && lightestColor.colorValue.toString() === lighterColor.colorValue.toString()) {
      lighterBlue = Math.min(lightestBlue - 128, 0);
      lighterColor = app.documents[0].colors.add({
        space: ColorSpace.RGB,
        colorValue: [rgbValues[0], rgbValues[1], lighterBlue],
      });
    }

    darkestColor = app.documents[0].colors.add({
      space: ColorSpace.RGB,
      colorValue: [rgbValues[0], rgbValues[1], darkestBlue],
    });
    darkerColor = app.documents[0].colors.add({
      space: ColorSpace.RGB,
      colorValue: [rgbValues[0], rgbValues[1], darkerBlue],
    });
  }

  palette.push(lightestColor);
  palette.push(lighterColor);
  palette.push(color);
  palette.push(darkerColor);
  palette.push(darkestColor);

  return palette;
}
