import DimensionSelectorSection from "../../lib/ReactViews/Workbench/Controls/DimensionSelectorSection";
import { findAllWithType } from "react-shallow-testutils";
import { getShallowRenderedOutput } from "./MoreShallowTools";
import React from "react";
import Terria from "../../lib/Models/Terria";
import WebMapServiceCatalogItem from "../../lib/Models/WebMapServiceCatalogItem";
import CommonStrata from "../../lib/Models/CommonStrata";
import { runInAction } from "mobx";
import SelectableDimensions from "../../lib/Models/SelectableDimensions";
// import CsvCatalogItem from "../../lib/Models/CsvCatalogItem";

describe("DimensionSelectorSection", function() {
  let terria: Terria;

  beforeEach(function() {
    terria = new Terria({
      baseUrl: "./"
    });
  });

  it("shows all dimensions and styles for a mock wms layer", function(done) {
    const mockItem: SelectableDimensions = {
      selectableDimensions: [
        {
          id: "some-id",
          name: "Some name",
          options: [
            { id: "option-1", name: "Option 1" },
            { id: "option-2", name: "Option 2" }
          ],
          selectedId: "option-2",
          allowUndefined: true,
          setDimensionValue: (stratumId: string, newStyle: string) => {}
        },
        {
          id: "some-id-2",
          name: "Some name 2",
          options: [
            { id: "option-3", name: "Option 3" },
            { id: "option-4", name: "Option 4" },
            { id: "option-5", name: "Option 5" }
          ],
          selectedId: "option-3",
          allowUndefined: false,
          setDimensionValue: (stratumId: string, newStyle: string) => {}
        }
      ]
    };

    const section = <DimensionSelectorSection item={mockItem} />;
    const result = getShallowRenderedOutput(section);
    const selects = findAllWithType(result, "select");
    expect(selects.length).toBe(2);

    const dim1 = selects[0];
    expect(dim1.props.name).toContain("some-id");
    expect(dim1.props.value).toBe("option-2");
    const elevationOptions = findAllWithType(dim1, "option");
    expect(elevationOptions.length).toBe(3); // This contains an 'undefined' option

    const dim2 = selects[1];
    expect(dim2.props.name).toContain("some-id-2");
    expect(dim2.props.value).toBe("option-3");
    const customOptions = findAllWithType(dim2, "option");
    expect(customOptions.length).toBe(3);

    done();
  });

  it("show dimensions and styles for a 'real' WMS layer", function(done) {
    const wmsItem = new WebMapServiceCatalogItem("some-layer", terria);
    runInAction(() => {
      wmsItem.setTrait(CommonStrata.definition, "url", "http://example.com");
      wmsItem.setTrait(
        CommonStrata.definition,
        "getCapabilitiesUrl",
        "test/WMS/styles_and_dimensions.xml"
      );
      wmsItem.setTrait(CommonStrata.definition, "layers", "A,B");
      wmsItem.setTrait(CommonStrata.definition, "parameters", {
        styles: "contour/ferret,shadefill/alg2",
        custom: "Another thing",
        elevation: "-0.59375"
      });
    });

    wmsItem
      .loadMetadata()
      .then(function() {
        const section = <DimensionSelectorSection item={wmsItem} />;
        const result = getShallowRenderedOutput(section);
        const selects = findAllWithType(result, "select");
        const labels = findAllWithType(result, "label");

        // Expect 2 styles (layer A, layer B) + 3 dimensions (elevation, custom, another)
        expect(selects.length).toBe(5);
        expect(labels.length).toBe(5);

        // Check Style A
        expect(selects[0].props.name).toContain(`${wmsItem.uniqueId}-A-styles`);
        expect(selects[0].props.value).toBe("contour/ferret");
        expect(findAllWithType(selects[0], "option").length).toBe(40);

        // Check Style B
        expect(selects[1].props.name).toContain(`${wmsItem.uniqueId}-B-styles`);
        expect(selects[1].props.value).toBe("shadefill/alg2");
        expect(findAllWithType(selects[1], "option").length).toBe(40);

        // Check elevation dimension
        expect(selects[2].props.name).toContain(
          `${wmsItem.uniqueId}-elevation`
        );
        expect(selects[2].props.value).toBe("-0.59375");
        expect(findAllWithType(selects[2], "option").length).toBe(16);

        // Check "custom" dimension
        expect(selects[3].props.name).toContain(`${wmsItem.uniqueId}-custom`);
        expect(selects[3].props.value).toBe("Another thing");
        expect(findAllWithType(selects[3], "option").length).toBe(4);

        // Check "another" dimension
        expect(selects[4].props.name).toContain(`${wmsItem.uniqueId}-another`);
        expect(selects[4].props.value).toBe("Second"); // This is the default value set by GetCapabilities
        expect(findAllWithType(selects[4], "option").length).toBe(3);
      })
      .then(done)
      .catch(done.fail);
  });

  // it("shows csv styles and region mapping options", async function(done) {
  //   terria.configParameters.regionMappingDefinitionsUrl =
  //     "test/csv/regionMapping.json";

  //   const csvItem = new CsvCatalogItem("some-csv", terria);

  //   runInAction(() => {
  //     csvItem.setTrait(
  //       CommonStrata.definition,
  //       "url",
  //       "test/csv/lga_code_2015.csv"
  //     );
  //     csvItem.setTrait(
  //       CommonStrata.definition,
  //       "enableManualRegionMapping",
  //       true
  //     );
  //   });

  //   await csvItem.loadMetadata();
  //   await csvItem.loadMapItems();

  //   const section = <DimensionSelectorSection item={csvItem} />;
  //   const result = getShallowRenderedOutput(section);
  //   const selects = findAllWithType(result, "select");
  //   expect(selects.length).toBe(3);

  //   if (selects.length < 3) {
  //     done.fail("Not enough select objects");
  //   }

  //   expect(selects[0].props.name).toContain("activeStyle");
  //   // expect(selects[0].props.value).toBe("value");
  //   expect(findAllWithType(selects[0], "option".length).toBe(2));

  //   expect(selects[1].props.name).toContain("regionColumn");
  //   expect(selects[1].props.value).toBe("lga_code");
  //   expect(findAllWithType(selects[1], "option".length).toBe(2));

  //   expect(selects[2].props.name).toContain("regionMapping");
  //   expect(selects[2].props.value).toBe("LGA_2018");

  //   done();
  // });
});
