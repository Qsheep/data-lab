/* Keep embedded Plotly figures fitted to the notebook output column.
 * Plotly serializes layout.width as pixels, so CSS alone can resize the
 * outer div while leaving the SVG/canvas at its original fixed width. */
(function () {
    "use strict";

    const measuredWidths = new WeakMap();

    function fitPlot(plot) {
        if (!window.Plotly || !plot || !plot._fullLayout) {
            return;
        }

        const output = plot.parentElement;
        const width = Math.floor(output ? output.clientWidth : 0);

        if (width <= 0 || measuredWidths.get(plot) === width) {
            return;
        }

        measuredWidths.set(plot, width);
        window.Plotly.relayout(plot, {width: width, autosize: true});
    }

    function fitAllPlots(root) {
        const scope = root && root.querySelectorAll ? root : document;
        scope.querySelectorAll(".cell_output .plotly-graph-div").forEach(fitPlot);
    }

    function start() {
        fitAllPlots(document);

        const resizeObserver = new ResizeObserver((entries) => {
            window.requestAnimationFrame(() => {
                entries.forEach((entry) => fitAllPlots(entry.target));
            });
        });

        document.querySelectorAll(".cell_output .output.text_html").forEach((output) => {
            resizeObserver.observe(output);
        });

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) {
                        return;
                    }

                    if (node.matches(".cell_output .output.text_html")) {
                        resizeObserver.observe(node);
                    }

                    fitAllPlots(node);
                });
            });
        });

        mutationObserver.observe(document.body, {childList: true, subtree: true});
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, {once: true});
    } else {
        start();
    }

    window.addEventListener("load", () => fitAllPlots(document), {once: true});
})();
