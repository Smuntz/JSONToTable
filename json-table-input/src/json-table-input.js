import { LitElement, html, css } from 'lit';

export class JsonTableInput extends LitElement {
  static properties = {
    jsonText: { type: String },
    data: { type: Array },
    error: { type: String }
  };

  static styles = css`
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #999;
      padding: 0.5rem;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
    }
    .error {
      color: red;
      margin-top: 5px;
    }
  `;

  static getMetaConfig() {
    return {
      controlName: 'JSON to Table',
      description: 'Displays a JSON object as a HTML table',
      iconUrl: 'one-line-text',
      groupName: 'Table Creator',
      fallbackDisableSubmit: false,
      version: '1.0.5',
      properties: {
        value: {
          type: 'string',
          title: 'Output',
          isValueField: true,
        },
        jsonText: {
          type: 'string',
          title: 'JSON Input',
          description: 'Enter a JSON object',
        },
      },
      standardProperties: {
        readOnly: true,
        required: true,
        description: true,
        visibility: true,
        fieldLabel: true,
      },
    };
  }

  constructor() {
    super();
    this.jsonText = '';
    this.data = [];
    this.error = '';
  }

  updated(changedProps) {
    if (changedProps.has('jsonText')) {
      this.parseJson();
    }
  }

  parseJson() {
    if (!this.jsonText) {
      this.data = [];
      this.error = '';
      return;
    }
    try {
      const parsed = JSON.parse(this.jsonText);
      if (!Array.isArray(parsed)) {
        this.error = 'JSON must be an array of objects.';
        this.data = [];
        return;
      }
      this.error = '';
      this.data = parsed;
    } catch (err) {
      this.error = 'Invalid JSON: ' + err.message;
      this.data = [];
    }
  }

  render() {
    return html`
      ${this.error
        ? html`<div class="error">${this.error}</div>`
        : this.renderDataTable()}
    `;
  }

  renderDataTable() {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      return html`<p>No data to display.</p>`;
    }

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return html`
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map(row => {
            const values = Object.values(row);
            const val1 = values[0] ?? '';
            const val2 = values[1] ?? '';
            let val3 = values[2] ?? '';

            if (val3 !== '') {
              const num = Number(val3);
              if (!isNaN(num)) {
                val3 = currencyFormatter.format(num);
              }
            }

            return html`
              <tr>
                <td>${val1}</td>
                <td>${val2}</td>
                <td>${val3}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }
}

const elementName = 'jsontohtmltable-input';
customElements.define(elementName, JsonTableInput);
