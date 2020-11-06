"use strict";

import createReactClass from "create-react-class";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import React from "react";
import CommonStrata from "../../../Models/CommonStrata";
import hasTraits from "../../../Models/hasTraits";
import RasterLayerTraits from "../../../Traits/RasterLayerTraits";
import OpacityTrait from "../../../Traits/OpacityTrait";
import Styles from "./opacity-section.scss";
import { withTranslation } from "react-i18next";
import { runInAction } from "mobx";

const OpacitySection = observer(
  createReactClass({
    displayName: "OpacitySection",

    propTypes: {
      item: PropTypes.object.isRequired,
      t: PropTypes.func.isRequired
    },

    changeOpacity(value) {
      const item = this.props.item;
      if (
        hasTraits(item, RasterLayerTraits, "opacity") ||
        hasTraits(item, OpacityTrait, "opacity")
      ) {
        runInAction(() => {
          item.setTrait(CommonStrata.user, "opacity", value / 100.0);
        });
      }
    },

    render() {
      const item = this.props.item;
      const { t } = this.props;
      if (
        (!hasTraits(item, RasterLayerTraits, "opacity") &&
          !hasTraits(item, OpacityTrait, "opacity")) ||
        item.disableOpacityControl
      ) {
        return null;
      }
      return (
        <div className={Styles.opacity}>
          <label htmlFor="opacity">
            {t("workbench.opacity", {
              opacity: parseInt(item.opacity * 100, 10)
            })}
          </label>
          <Slider
            className={Styles.opacitySlider}
            min={0}
            max={100}
            value={(item.opacity * 100) | 0}
            onChange={this.changeOpacity}
          />
        </div>
      );
    }
  })
);

module.exports = withTranslation()(OpacitySection);
