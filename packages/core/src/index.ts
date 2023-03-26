import { Configuration, OpenAIApi } from 'openai';
import type OpenAI from 'openai';

import { cleanPrompt, extractJSON } from './utils';

export type APIResponse = {
  status: any;
  error: any;
  data: any;
};

export default class Core {
  protected configuration: OpenAI.Configuration;
  protected api: OpenAI.OpenAIApi;
  protected context: string = '';
  protected dbState: any = [];

  constructor({ apiKey, context }: { apiKey: string; context?: string }) {
    if (!apiKey) {
      throw new Error('No API key provided');
    }

    this.configuration = new Configuration({ apiKey });
    this.api = new OpenAIApi(this.configuration);

    this.context = context || this.context;
  }

  async sendRequest({
    endpoint,
    context,
  }: {
    endpoint: string;
    context?: string;
  }): Promise<APIResponse> {
    this.context = context || this.context;

    const messages = this._buildMessages(endpoint);
    const response = await this.api.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });
    const { apiResponse, dbState } = this._parseCompletion(response.data);

    this.dbState = dbState || this.dbState;
    return apiResponse;
  }

  protected _buildMessages(
    endpoint: string
  ): OpenAI.ChatCompletionRequestMessage[] {
    const instructions = `
      Output 2 lines separated by line breaks.

      The first line contains the API response as minified json, it should always have the properties 'status', 'error' and 'data'.
      The second line contains the new database state as minified json.

      If the API call is only requesting data, then don't change the database state, just return the data.
      If the API call is creating or mutating an item in the database, then just return the updated item in 'data'.

      If you're creating a new item in db, assign it a random uuid as id with digits and letters and a created_at timestamp.
    `;

    const jsonDbState = JSON.stringify(this.dbState);

    const contextLine = this.context
      ? `Here's the additional context: ${this.context}`
      : '';

    const systemPrompt = `
      You're an API.
      ${contextLine}

      --
      Here's how you should respond to the API calls:

      ${instructions}
    `;
    const userPrompt = `
      api_call:
      ${endpoint}
      --
      current_timestamp:
      ${Date.now()}
      --
      db_state:
      ${jsonDbState}
    `;

    return [
      { role: 'system', content: cleanPrompt(systemPrompt) },
      { role: 'user', content: cleanPrompt(userPrompt) },
    ];
  }

  protected _parseCompletion(completion: OpenAI.CreateChatCompletionResponse): {
    apiResponse: APIResponse;
    dbState: any;
  } {
    const content = completion.choices[0].message.content;
    const [apiResponse, dbState] = content
      .split('\n')
      .filter((line) => line.trim())
      .map(extractJSON);

    return { apiResponse, dbState };
  }
}
