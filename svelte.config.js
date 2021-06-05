const preprocess = require("svelte-preprocess");

module.exports = {
	preprocess: preprocess({
		scss: {
			prependData: `
                @import "src/scss/_variables.scss";
                @import "src/scss/_mixins.scss";
            `,
		},
	}),
};
