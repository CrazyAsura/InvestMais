import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { InvestmentResponseDto } from './dto/investimentos.dto';

@Injectable()
export class InvestimentosService {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async getStockPrice(symbol: string): Promise<InvestmentResponseDto> {
    const url = `https://finance.yahoo.com/quote/${symbol}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      const $ = cheerio.load(response.data);

      const priceSelector = `fin-streamer[data-symbol="${symbol}"][data-field="regularMarketPrice"]`;
      const changeSelector = `fin-streamer[data-symbol="${symbol}"][data-field="regularMarketChange"]`;
      const changePercentSelector = `fin-streamer[data-symbol="${symbol}"][data-field="regularMarketChangePercent"]`;
      const nameSelector = `h1[class*="yf-"]`; // Yahoo Finance title selector

      const priceText = $(priceSelector).first().text() || $('fin-streamer[data-field="regularMarketPrice"]').first().text();
      const changeText = $(changeSelector).first().text();
      const changePercentText = $(changePercentSelector).first().text();
      const nameText = $(nameSelector).first().text().split(' (')[0] || symbol;

      if (!priceText) {
        // Fallback: try to find in meta tags
        const metaPrice = $('meta[property="og:description"]').attr('content');
        if (metaPrice) {
          const match = metaPrice.match(/([\d,.]+)/);
          if (match) {
            return {
              symbol,
              name: symbol,
              type: symbol.includes('.SA') ? 'Ação' : 'ETF',
              price: parseFloat(match[1].replace(',', '')),
              currency: 'BRL',
              change: 'N/A',
              changePercent: 'N/A',
              lastUpdated: new Date(),
            };
          }
        }
        throw new NotFoundException(`Could not find price for symbol: ${symbol}`);
      }

      return {
        symbol,
        name: nameText,
        type: symbol.includes('.SA') ? 'Ação' : 'ETF',
        price: parseFloat(priceText.replace(',', '')),
        currency: 'BRL',
        change: changeText,
        changePercent: changePercentText,
        lastUpdated: new Date(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error fetching stock data: ${error.message}`);
    }
  }

  async getTrendingInvestments() {
    // Simular alguns investimentos populares se o scraping falhar ou for lento
    const symbols = ['PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'AAPL', 'GOOGL'];
    const results: InvestmentResponseDto[] = [];

    for (const symbol of symbols) {
      try {
        const data = await this.getStockPrice(symbol);
        results.push(data);
      } catch (e) {
        // Ignorar erros individuais para não quebrar a lista
        console.error(`Error fetching ${symbol}: ${e.message}`);
      }
    }

    return results;
  }

  async getCategories() {
    return [
      { id: '1', name: 'Renda Fixa', icon: 'account-balance' },
      { id: '2', name: 'Ações', icon: 'business' },
      { id: '3', name: 'FIIs', icon: 'domain' },
      { id: '4', name: 'Cripto', icon: 'currency-bitcoin' },
      { id: '5', name: 'Internacional', icon: 'public' },
    ];
  }
}
