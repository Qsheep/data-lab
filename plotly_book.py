"""Plotly display helpers for notebooks published with Jupyter Book."""

from IPython.display import HTML, display
import plotly.io as pio


def show_plotly(fig, *, config=None):
    """Display an interactive figure without Plotly's legacy MathJax loader."""
    plot_config = {"responsive": True}
    if config:
        plot_config.update(config)

    return display(
        HTML(
            pio.to_html(
                fig,
                full_html=False,
                include_plotlyjs="cdn",
                include_mathjax=False,
                config=plot_config,
            )
        )
    )
