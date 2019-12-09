import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues, reset } from 'redux-form';
import Modal from 'yii-steroids/ui/modal/Modal';
import { t } from 'locales/config';

import { html, dal } from 'components';
import validate from 'shared/validate';
import TransferForm from 'shared/TransferForm';
import TransferInfo from 'shared/TransferInfo';
import PairsEnum from 'enums/PairsEnum';
// import {getPairName} from 'reducers/currency';

import './TransferModal.scss';

const bem = html.bem('TransferModal');
const FORM_ID = 'TransferModalForm';

@connect(state => ({
    // pairName: getPairName(state),
    formValues: getFormValues(FORM_ID)(state),
}))
export default class TransferModal extends React.PureComponent {
    static propTypes = {
        currency: PropTypes.string,
    };

    constructor() {
        super(...arguments);

        this.state = {
            isSuccess: false,
        };

        this._onSubmit = this._onSubmit.bind(this);
    }

    render() {
        const { currency, formValues } = this.props;

        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block({
                    'is-success': this.state.isSuccess,
                })}
            >
                <div className={bem.element('header')}>
                    {this.state.isSuccess
                        ? t('modals.successful_transfer.label')
                        : t('modals.transferring_funds_to_user.label')
                    }
                </div>
                <div className={bem.element('inner')}>
                    <div
                        className={bem.element('form', {
                            'd-none': this.state.isSuccess,
                        })}
                    >
                        <TransferForm
                            formId={FORM_ID}
                            onSubmit={this._onSubmit}
                            currency={this.props.currency}
                        />
                    </div>
                    <div
                        className={bem.element('success', {
                            'd-none': !this.state.isSuccess,
                        })}
                    >
                        <div className={bem.element('success-icon')}>
                            <span className={'Icon Icon__successful'} />
                        </div>
                        <TransferInfo
                            {...formValues}
                            onClose={this.state.isSuccess && this.props.onClose}
                            currency={currency}
                            onSubmit={() => {
                                this.setState({ isSuccess: false });
                                this.props.dispatch(reset(FORM_ID));
                            }}
                        />
                    </div>
                </div>
            </Modal>
        );
    }

    _onSubmit(address, amount) {
        validate(address, [
            [
                'address',
                function(address) {
                    if (/^[A-Za-z0-9]{30,40}$/.test(address) === false) {
                        return t('modals.recipient_address_is_invalid.label');
                    }
                },
            ],
        ]);

        dal.transferFunds(
            PairsEnum.USDNB_USDN, //TODO
            this.props.currency,
            address,
            amount
        )
            .then(() => {
                this.setState({
                    isSuccess: true,
                });
            })
            .catch(err => console.log('Transfer error: ', err));
    }
}
