<template>
  <div
    class="identicon"
    :style="{
      backgroundImage: 'url(' + img + ')',
      width: 8 * size + 'px',
      height: 8 * size + 'px'
    }"
  >
    <q-menu v-if="menu" context-menu>
      <q-list separator class="context-menu">
        <q-item v-close-popup clickable :disabled="img == defaultImg" @click.native="saveIdenticon()">
          <q-item-section>
            Save identicon to file
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script>
export default {
  name: "Identicon",
  props: {
    address: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 5
    },
    menu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      randseed: new Array(4),
      img: "",
      defaultImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gkHECkpHU3uFgAAAZlJREFUWMPt2D1PwkAYB/D/AxWIbZUCAvGNwZiAcTG+JQ4sJn4AV7+UfgNXjY6ObrppXBiEGBMUgimKKHDy2jpUUHGTIhe5Z7rc8OTX9p67e0oXu3cmOA4HOA8BFEABFMBhB0q9JnBrEgIxGeqsGx7fCBwSoVExUMpUoV+VwPTG4ICRLQ2BmPJj3qU44Y/K8EdlpE8LeExUBgPU5kZhGiaYXkfmrIhytg6SgMn1cYSWVRARIps+ML3+6zfZE5Dl60gd5b/NmU0ge/6CQpJhYScMAPBFZTC9+PdF0o37GtViE6ZhXZQ8Xom/KiYCQNa4+WbwB5yOe0FkCQspxhcwtKJiYtGq7ucbhtd0dXD7YHeEV1VMbXgBAOVcDbcnT/ycJMElpYOrPNSQPNR5OupMzMS1zvZzfaDbktU2YHht7HP7OdZte2zbgHLI3Rm3aiZ/QHJ+fGjD3i7WNqDTZaUiB/F13WqHHRXbV6BHk0BOAhHA8g3+gPPbQbgUayFe7t3ztwbNVn9+8fz/nqQdif2caDsFUAAFUACHEfgOXvt3FLbL3AsAAAAASUVORK5CYII="
    };
  },
  computed: {
    isDefault: function() {
      return this.img == this.defaultImg;
    }
  },
  watch: {
    address: function(address) {
      if (address && this.isAddressValid(address)) {
        this.createIcon({
          seed: address,
          scale: this.size
        });
      } else {
        this.img = this.defaultImg;
      }
    }
  },
  created() {
    if (this.address && this.isAddressValid(this.address)) {
      this.createIcon({
        seed: this.address,
        scale: 12
      });
    } else {
      this.img = this.defaultImg;
    }
  },
  methods: {
    saveIdenticon() {
      if (this.img == this.defaultImg) return;
      this.$gateway.send("core", "save_png", {
        img: this.img,
        type: "Identicon"
      });
    },

    isAddressValid(input) {
      if (!/^[0-9A-Za-z]+$/.test(input)) return false;

      switch (input.substring(0, 4)) {
        case "Sumo":
        case "RYoL":
        case "Suto":
        case "RYoT":
          return input.length === 99;

        case "Subo":
        case "Suso":
          return input.length == 98;

        case "RYoS":
        case "RYoU":
          return input.length == 99;

        case "Sumi":
        case "RYoN":
        case "Suti":
        case "RYoE":
          return input.length === 110;

        case "RYoK":
        case "RYoH":
          return input.length === 55;

        default:
          return false;
      }
    },

    seedrand(seed) {
      for (var i = 0; i < this.randseed.length; i++) {
        this.randseed[i] = 0;
      }
      for (var j = 0; j < seed.length; j++) {
        this.randseed[j % 4] = (this.randseed[j % 4] << 5) - this.randseed[j % 4] + seed.charCodeAt(j);
      }
    },

    rand() {
      // based on Java's String.hashCode(), expanded to 4 32bit values
      var t = this.randseed[0] ^ (this.randseed[0] << 11);

      this.randseed[0] = this.randseed[1];
      this.randseed[1] = this.randseed[2];
      this.randseed[2] = this.randseed[3];
      this.randseed[3] = this.randseed[3] ^ (this.randseed[3] >> 19) ^ t ^ (t >> 8);

      return (this.randseed[3] >>> 0) / ((1 << 31) >>> 0);
    },

    createColor() {
      //saturation is the whole color spectrum
      var h = Math.floor(this.rand() * 360);
      //saturation goes from 40 to 100, it avoids greyish colors
      var s = this.rand() * 60 + 40 + "%";
      //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
      var l = (this.rand() + this.rand() + this.rand() + this.rand()) * 25 + "%";

      var color = "hsl(" + h + "," + s + "," + l + ")";
      return color;
    },

    createImageData(size) {
      var width = size; // Only support square icons for now
      var height = size;

      var dataWidth = Math.ceil(width / 2);
      var mirrorWidth = width - dataWidth;

      var data = [];
      for (var y = 0; y < height; y++) {
        var row = [];
        for (var x = 0; x < dataWidth; x++) {
          // this makes foreground and background color to have a 43% (1/2.3) probability
          // spot color has 13% chance
          row[x] = Math.floor(this.rand() * 2.3);
        }
        var r = row.slice(0, mirrorWidth);
        r.reverse();
        row = row.concat(r);

        for (var i = 0; i < row.length; i++) {
          data.push(row[i]);
        }
      }

      return data;
    },

    buildOpts(opts) {
      var newOpts = {};

      newOpts.seed = opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);

      this.seedrand(newOpts.seed);

      newOpts.size = opts.size || 8;
      newOpts.scale = opts.scale || 4;
      newOpts.color = opts.color || this.createColor();
      newOpts.bgcolor = opts.bgcolor || this.createColor();
      newOpts.spotcolor = opts.spotcolor || this.createColor();

      return newOpts;
    },

    renderIcon(opts, canvas) {
      opts = this.buildOpts(opts || {});
      var imageData = this.createImageData(opts.size);
      var width = Math.sqrt(imageData.length);

      canvas.width = canvas.height = opts.size * opts.scale;

      var cc = canvas.getContext("2d");
      cc.fillStyle = opts.bgcolor;
      cc.fillRect(0, 0, canvas.width, canvas.height);
      cc.fillStyle = opts.color;

      for (var i = 0; i < imageData.length; i++) {
        // if data is 0, leave the background
        if (imageData[i]) {
          var row = Math.floor(i / width);
          var col = i % width;

          // if data is 2, choose spot color, if 1 choose foreground
          cc.fillStyle = imageData[i] == 1 ? opts.color : opts.spotcolor;

          cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
        }
      }
      return canvas;
    },

    createIcon(opts) {
      var canvas = document.createElement("canvas");
      this.renderIcon(opts, canvas);
      this.img = canvas.toDataURL();
    }
  }
};
</script>

<style></style>
