import React from 'react';
import Modal from 'react-modal';
import { html } from 'components';
import { BlurContext } from 'shared/Layout/context';
import usdnLogo from 'static/icons/usd-n.svg';
import neutrinoManIcon from 'static/images/neutrino-man.svg';
import graphsIcon from 'static/images/graphs.svg';
import spotImage from 'static/images/spot.svg';

import './style.scss';

const bem = html.bem('UserCongratsModal');

interface Props {
    title: string;
    isOpened: boolean;
    onClose: () => void;
}
interface Link {
    logo: string;
    url: string;
    label: string;
}

class UserCongratsModal extends React.Component<Props> {
    constructor(props) {
        super(props);

        this.mapLink = this.mapLink.bind(this);
    }

    static contextType = BlurContext;

    mapLink({ url, label, icon, target }: Link & { target: string; icon: string }) {
        return (
            <div className={bem.element('logo-link')}>
                <img src={icon} alt={label} />
                <a href={url} target={target}>
                    {label}
                </a>
            </div>
        );
    }

    componentDidUpdate() {
        console.log(this.context);

        if (this.props.isOpened) {
            this.context.blur();
        } else {
            this.context.unblur();
        }
    }

    componentWillUnmount() {
        this.props.onClose();
        this.context.unblur();
    }

    render() {
        const { title = 'Congratulations!' } = this.props;
        const links = [
            {
                label: 'Collect staking rewards',
                url: '#',
                icon: neutrinoManIcon,
            },
            {
                label: 'Trade on exchanges',
                target: '_blank',
                url:
                    'https://dex.wavesplatform.com/dex-demo?assetId2=8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS&assetId1=DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
                icon: graphsIcon,
            },
        ].map(this.mapLink);

        return (
            <Modal
                className={bem.block()}
                isOpen={this.props.isOpened}
                onRequestClose={this.props.onClose}
                parentSelector={() => document.body}
            >
                <div>
                    <div className={bem.element('main')}>
                        <div className={bem.element('title')}>{title}</div>
                        <div className={bem.element('body')}>
                            <img className={bem.element('usdn-logo')} src={usdnLogo} alt="" />
                            <div className={bem.element('msg')}>
                                <span>
                                    You are holder of USD-Neutrino (USD-N) - crypto-collateralized
                                    stablecoin.
                                </span>
                            </div>
                            <img className={bem.element('spot')} src={spotImage} />
                            <div className={bem.element('logos-flex')}>{links}</div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default UserCongratsModal;
