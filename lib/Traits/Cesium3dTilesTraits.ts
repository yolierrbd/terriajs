import { JsonObject } from "../Core/Json";
import anyTrait from "./anyTrait";
import CatalogMemberTraits from "./CatalogMemberTraits";
import FeatureInfoTraits from "./FeatureInfoTraits";
import MappableTraits from "./MappableTraits";
import ShadowTraits from "./ShadowTraits";
import mixTraits from "./mixTraits";
import ModelTraits from "./ModelTraits";
import objectArrayTrait from "./objectArrayTrait";
import objectTrait from "./objectTrait";
import primitiveTrait from "./primitiveTrait";
import UrlTraits from "./UrlTraits";
import TransformationTraits from "./TransformationTraits";
import PlaceEditorTraits from "./PlaceEditorTraits";
import primitiveArrayTrait from "./primitiveArrayTrait";
import OpacityTrait from "./OpacityTrait";

export class FilterTraits extends ModelTraits {
  @primitiveTrait({
    type: "string",
    name: "Name",
    description: "A name for the filter"
  })
  name?: string;

  @primitiveTrait({
    type: "string",
    name: "property",
    description: "The name of the feature property to filter"
  })
  property?: string;

  @primitiveTrait({
    type: "number",
    name: "minimumValue",
    description: "Minimum value of the property"
  })
  minimumValue?: number;

  @primitiveTrait({
    type: "number",
    name: "minimumValue",
    description: "Minimum value of the property"
  })
  maximumValue?: number;

  @primitiveTrait({
    type: "number",
    name: "minimumShown",
    description: "The lowest value the property can have if it is to be shown"
  })
  minimumShown?: number;

  @primitiveTrait({
    type: "number",
    name: "minimumValue",
    description: "The largest value the property can have if it is to be shown"
  })
  maximumShown?: number;
}

export class PointCloudShadingTraits extends ModelTraits {
  @primitiveTrait({
    type: "boolean",
    name: "Attenuation",
    description: "Perform point attenuation based on geometric error."
  })
  attenuation?: boolean;

  @primitiveTrait({
    type: "number",
    name: "geometricErrorScale",
    description: "Scale to be applied to each tile's geometric error."
  })
  geometricErrorScale?: number;
}

export class OptionsTraits extends ModelTraits {
  @primitiveTrait({
    type: "number",
    name: "Maximum screen space error",
    description:
      "The maximum screen space error used to drive level of detail refinement."
  })
  maximumScreenSpaceError?: number;

  @primitiveTrait({
    type: "number",
    name: "Maximum number of loaded tiles",
    description: ""
  })
  maximumNumberOfLoadedTiles?: number;

  @objectTrait({
    type: PointCloudShadingTraits,
    name: "Point cloud shading",
    description: "Point cloud shading parameters"
  })
  pointCloudShading?: PointCloudShadingTraits;
}

export default class Cesium3DTilesTraits extends mixTraits(
  PlaceEditorTraits,
  TransformationTraits,
  FeatureInfoTraits,
  MappableTraits,
  UrlTraits,
  CatalogMemberTraits,
  ShadowTraits,
  OpacityTrait
) {
  @primitiveTrait({
    type: "number",
    name: "Ion asset ID",
    description: "The Cesium Ion asset id."
  })
  ionAssetId?: number;

  @primitiveTrait({
    type: "string",
    name: "Ion access token",
    description: "Cesium Ion access token id."
  })
  ionAccessToken?: string;

  @primitiveTrait({
    type: "string",
    name: "Ion server",
    description: "URL of the Cesium Ion API server."
  })
  ionServer?: string;

  @objectTrait({
    type: OptionsTraits,
    name: "options",
    description:
      "Additional options to pass to Cesium's Cesium3DTileset constructor."
  })
  options?: OptionsTraits;

  @anyTrait({
    name: "style",
    description:
      "The style to use, specified according to the [Cesium 3D Tiles Styling Language](https://github.com/AnalyticalGraphicsInc/3d-tiles/tree/master/specification/Styling)."
  })
  style?: JsonObject;

  @objectArrayTrait({
    type: FilterTraits,
    idProperty: "name",
    name: "filters",
    description: "The filters to apply to this catalog item."
  })
  filters?: FilterTraits[];

  @primitiveTrait({
    name: "Color blend mode",
    type: "string",
    description:
      "The color blend mode decides how per-feature color is blended with color defined in the tileset. Acceptable values are HIGHLIGHT, MIX & REPLACE as defined in the cesium documentation - https://cesium.com/docs/cesiumjs-ref-doc/Cesium3DTileColorBlendMode.html"
  })
  colorBlendMode = "MIX";

  @primitiveTrait({
    name: "Color blend amount",
    type: "number",
    description:
      "When the colorBlendMode is MIX this value is used to interpolate between source color and feature color. A value of 0.0 results in the source color while a value of 1.0 results in the feature color, with any value in-between resulting in a mix of the source color and feature color."
  })
  colorBlendAmount = 0.5;

  @primitiveTrait({
    name: "Highlight color",
    type: "string",
    description:
      "The color used to highlight a feature when it is picked. If not set, this defaults to `Terria.baseMapContrastColor`"
  })
  highlightColor?: string;

  @primitiveArrayTrait({
    name: "Feature ID properties",
    type: "string",
    description:
      "One or many properties of a feature that together identify it uniquely. This is useful for setting properties for individual features. eg: ['lat', 'lon'], ['buildingId'] etc."
  })
  featureIdProperties?: string[];
}
