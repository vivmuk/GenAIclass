import matplotlib.pyplot as plt
import pandas as pd
import os

# Data
data = {
    "Model": [
        "GPT-4o", "Grok-2", "Claude 3.5 Sonnet", "GPT-4.5 Preview", "Gemini Thinking",
        "DeepSeek-R1", "o1", "Claude 3.7 Sonnet (16K)", "o3-mini (medium)", "o3-mini (high)"
    ],
    "Accuracy (%)": [3.1, 3.9, 4.8, 6.4, 7.2, 8.6, 8.8, 8.9, 11.1, 14.0],
    "Launch Date": [
        "May 13, 2024", "August 13, 2024", "June 20, 2024", "February 27, 2025", "December 11, 2024",
        "January 20, 2025", "December 5, 2024", "February 24, 2025", "January 31, 2025", "January 31, 2025"
    ]
}

df = pd.DataFrame(data)

# Set dark theme
plt.style.use('dark_background')
fig, ax = plt.figure(figsize=(12, 8)), plt.subplot(111)

# Set overall figure properties
fig.patch.set_facecolor('#121212')
ax.set_facecolor('#121212')

# Create horizontal bar chart
bars = ax.barh(df["Model"], df["Accuracy (%)"], color="#6E56CF", alpha=0.8)

# Customize chart appearance
ax.set_xlabel("Accuracy (%)", fontsize=12, color='white')
ax.xaxis.set_tick_params(colors='white')
ax.yaxis.set_tick_params(colors='white')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_color('#333333')
ax.spines['left'].set_color('#333333')
ax.grid(axis='x', linestyle='--', alpha=0.3)

# Add title
ax.set_title("AI Model Accuracy Comparison (Humanity's Last Exam)", fontsize=16, color='white', pad=20)

# Invert y-axis for better readability
ax.invert_yaxis()

# Annotate bars with launch dates
for bar, launch_date in zip(bars, df["Launch Date"]):
    ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height()/2, launch_date, 
             va='center', ha='left', fontsize=10, color='#cccccc')
    
    # Add accuracy percentage inside/outside bars depending on width
    width = bar.get_width()
    if width > 6:
        ax.text(width - 0.5, bar.get_y() + bar.get_height()/2, f"{width}%", 
                va='center', ha='right', fontsize=10, color='white', fontweight='bold')
    else:
        ax.text(width + 0.2, bar.get_y() + bar.get_height()/2, f"{width}%", 
                va='center', ha='left', fontsize=10, color='white', fontweight='bold')

# Ensure tight layout
plt.tight_layout()

# Save the chart
os.makedirs('images', exist_ok=True)
plt.savefig('images/ai-accuracy-2025.svg', format='svg', transparent=True, bbox_inches='tight')
plt.savefig('images/ai-accuracy-2025.png', format='png', dpi=300, bbox_inches='tight')

print("Chart created successfully and saved to images/ai-accuracy-2025.svg and images/ai-accuracy-2025.png") 