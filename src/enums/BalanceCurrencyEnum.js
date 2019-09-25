import Enum from './Enum';

export default class BalanceCurrencyEnum extends Enum {

    static WAVES = 'waves';
    static USD_N = 'usd-n';
    static USD_NB = 'usd-nb';

    static getKeys() {
        return [
            this.WAVES,
            this.USD_N,
            this.USD_NB,
        ];
    }

    static getLabels() {
        return {
            [this.WAVES]: __('WAVES'),
            [this.USD_N]: __('USD-N'),
            [this.USD_NB]: __('USD-NB'),
        };
    }
}
