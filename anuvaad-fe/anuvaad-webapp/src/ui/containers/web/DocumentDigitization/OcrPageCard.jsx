import React from "react";
import { Paper, Divider } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import sentenceHighlight from '../../../../utils/SentenceHighlight'
import DownloadJSON from '../../../../flux/actions/apis/download/download_json';
import DownloadFile from '../../../../flux/actions/apis/download/download_zip_file';
import { Textfit } from "react-textfit";
import { highlightSentence, clearHighlighBlock, cancelMergeSentence } from '../../../../flux/actions/users/translator_actions';
import Popper from '@material-ui/core/Popper';
import SENTENCE_ACTION from '../DocumentEditor/SentenceActions'
import { confscore } from '../../../../utils/OcrConfScore'
import SaveEditedWord from './SaveEditedWord';
import Modal from '@material-ui/core/Modal';


const PAGE_OPS = require("../../../../utils/page.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')

const styles = {
    textField: {
        width: "100%",
        background: 'rgb(211,211,211)',
        borderRadius: 10,
        border: 0,
        color: 'green',
    }
}


class OcrPageCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            text: '',
            url: '',
            event: false,
            isOpen: false,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.action = null
    }

    componentDidUpdate(prevProps) {
        if (prevProps.block_highlight !== this.props.block_highlight && this.props.block_highlight.block_identifier) {
            this.handleSourceScroll(this.props.block_highlight.block_identifier)
        }
        if (prevProps.status !== this.props.status) {
            this.setState({ url: '' })
        }
    }

    /**
     * render Sentences
     */

    renderChild = (region) => {
        let width = (region.boundingBox.vertices[1].x - region.boundingBox.vertices[0].x) + 'px'
        let height = (region.boundingBox.vertices[2].y - region.boundingBox.vertices[0].y) + 'px'
        let top = (region.boundingBox.vertices[0].y) + 'px'
        let left = (region.boundingBox.vertices[0].x) + 'px'
        return (
            <div style={{
                position: "absolute",
                height: height,
                width: width,
                top: top,
                left: left,
                zIndex: 2,
            }}
                id={region.identifier}
                key={region.identifier}
            >

                {
                    region['regions'] &&
                    region['regions'].map(line => this.renderText(line, region))
                }
            </div>
        );
    }

    renderText = (line, region) => {
        return (
            <div
                style={{
                    border: line.class === 'CELL' && '1px solid black',
                    top: line.class === 'CELL' && line.boundingBox.vertices[0].y - region.boundingBox.vertices[0].y + 'px',
                    left: line.class === 'CELL' && line.boundingBox.vertices[0].x - region.boundingBox.vertices[0].x + 'px',
                    height: line.class === 'CELL' && line.boundingBox.vertices[2].y - line.boundingBox.vertices[0].y + 'px',
                    width: line.class === 'CELL' && line.boundingBox.vertices[1].x - line.boundingBox.vertices[0].x + 'px',
                    position: line.class === 'CELL' && 'absolute',
                }}
                key={line.identifier}>
                {
                    line.regions.map(word => line.class !== 'CELL' ?
                        this.renderTextSpan(word, region) :
                        this.renderTable(word, line)
                    )
                }
            </div>
        )
    }

    renderTable = (word, line) => {
        return (
            <div
                style={{
                    position: "absolute",
                    fontSize: word.font && `min(max(${word.font.size}px),${this.props.fontSize}px)`,
                    top: word.boundingBox.vertices[0].y - line.boundingBox.vertices[0].y + 'px',
                    left: word.boundingBox.vertices[0].x - line.boundingBox.vertices[0].x + 'px',
                    maxWidth: word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x + 'px',
                    maxHeight: word.boundingBox.vertices[2].y - word.boundingBox.vertices[0].y + 'px',
                    width: 'fit-content',
                    height: '100%',
                    fontFamily: word.font && word.font.family,
                }}
                key={word.identifier}
                onDoubleClick={() => this.setModalState(word)}
            >
                {
                    this.state.id === word.identifier ? this.state.text : word.text
                }
            </div >
        )
    }

    renderTextSpan = (word, region) => {
        return (
            <div
                style={{
                    position: "absolute",
                    fontSize: `${this.props.fontSize}px`,
                    top: word.boundingBox.vertices[0].y - region.boundingBox.vertices[0].y + 'px',
                    left: word.boundingBox.vertices[0].x - region.boundingBox.vertices[0].x + 'px',
                    maxWidth: word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x + 'px',
                    maxHeight: word.boundingBox.vertices[2].y - word.boundingBox.vertices[0].y + 'px',
                    width: 'fit-content',
                    height: '100%',
                    fontFamily: word.font && word.font.family,
                }}
                key={word.identifier}
                onDoubleClick={() => this.setModalState(word)}>
                {
                    this.state.id === word.identifier ? this.state.text : word.text
                }
            </div>
        )
    }

    setModalState = (word) => {
        this.setState({ isOpen: true, text: word.text, id: word.identifier })
    }

    saveWord = (word) => {
        let originalWord = this.state.text;
        let changedWord = word
        TELEMETRY.saveEditedWordEvent(originalWord, changedWord, 'SAVE_EDITED_WORD')
        this.setState({ isOpen: false, text: changedWord })
    }
    renderModal = () => {
        return (
            <Modal
                open={this.state.isOpen}
                onClose={this.handleClose}
            >
                <SaveEditedWord handleClose={this.handleClose} text={this.state.text} id={this.state.id} saveWord={this.saveWord} />
            </Modal>
        )
    }

    handleClose = () => {
        this.setState({ isOpen: false })
    }
    /**
     * sentence change
     */
    handleTextChange(event) {
        this.action = 'user_typed'
        this.setState({ text: event.target.value });
    }

    /**
     * render sentence edit
     */
    renderTextField = (text) => {
        return (
            <TextField
                style={styles.textField}
                type="text"
                // className="form-control"
                value={this.state.text}
                variant="outlined"
                // id="mui-theme-provider-outlined-input"
                onChange={this.handleTextChange}
                onBlur={() => { this.handleClickAway(text) }}
                autoFocus={true}
                fullWidth
                multiline
            />
        )
    }


    /**
     * render sentence edit
     */
    handleSelectedSentenceId = (event, text) => {
        this.setState({ text: text.text, event: event.currentTarget })
        this.action = text.identifier;
    }
    /**
     * click away listner
     */
    handleClickAway = (blockData) => {
        if (this.state.text && (this.action === 'user_typed')) {
            TELEMETRY.sentenceChanged(blockData.text, this.state.text, blockData.block_id, "validation", '')
            let data = PAGE_OPS.get_updated_page_blocks(this.props.document_contents, blockData, this.state.text)
            this.props.onAction(SENTENCE_ACTION.SENTENCE_SOURCE_EDITED, blockData.page_no, [data], "")
        }
        this.setState({ text: null })
        this.action = null;
    }

    handleSourceScroll(id) {
        this.refs[id] && this.refs[id].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    getBGImage = (image) => {
        let obj = new DownloadFile(image);
        const apiReq1 = fetch(obj.apiEndPoint(), {
            method: "get",
            headers: obj.getHeaders().headers,
        })
            .then(async (response) => {
                if (!response.ok) {
                    this.setState({
                        dialogMessage: "Failed to download file...",
                        timeOut: 3000,
                        variant: "info",
                    });
                    console.log("api failed");
                } else {
                    const buffer = new Uint8Array(await response.arrayBuffer());
                    let res = Buffer.from(buffer).toString("base64");
                    if (!this.state.url)
                        fetch("data:image/jpeg;base64," + res)
                            .then(res => res.blob())
                            .then(blob => {
                                let url = URL.createObjectURL(blob);
                                this.setState({ url })
                            });
                }
            })
            .catch((error) => {
                this.setState({
                    dialogMessage: "Failed to download file...",
                    timeOut: 3000,
                    variant: "info",
                });
                console.log("api failed because of server or network", error);
            });
    }

    renderImage = (image) => {
        if (this.props.status) {
            let width = image.boundingBox.vertices[1].x - image.boundingBox.vertices[0].x + 'px'
            let height = image.boundingBox.vertices[2].y - image.boundingBox.vertices[0].y + 'px'
            let img = image.data.replace('upload/', '')

            let style = {
                position: "relative",
                width: width,
                height: height,
                overflow: "hidden",
                zIndex: 1
            }

            this.getBGImage(img)
            return (
                <div style={style} key={image.identifier}>
                    <img width={width} height={height} src={this.state.url} alt=""></img>
                </div>
            )
        }
        else {
            return <div key={image.identifier}></div>
        }
    }

    setOnMouseUp = (e) => {
        this.setState({ x2: e.clientX, y2: e.clientY }, () => {
            let { x1, x2, y1, y2, top, left } = this.state
            let div = document.createElement('div')
            div.style.width = (x2 - x1) + 'px'
            div.style.height = (y2 - y1) + 'px'
            div.style.top = top + 'px'
            div.style.left = left + 'px'
            div.style.position = "absolute"
            div.style.border = "1px solid white"
            this.paper.appendChild(div)
        })

    }

    setOnMouseDown = (e) => {
        this.setState({ x1: e.clientX, y1: e.clientY, top: e.nativeEvent.offsetY, left: e.nativeEvent.offsetX })
    }
    renderPage = (page, image) => {
        if (page) {
            let width = page['boundingBox'] && page.boundingBox.vertices[1].x - page.boundingBox.vertices[0].x + 'px'
            let height = page['boundingBox'] && page.boundingBox.vertices[2].y - page.boundingBox.vertices[0].y + 'px'
            return (
                <div>
                    <Paper
                        ref={e => this.paper = e}
                        onMouseUp={this.setOnMouseUp}
                        onMouseDown={this.setOnMouseDown}
                        elevation={2} style={{ position: 'relative', width: width, height: height }}>
                        {page['regions'].map(region => this.renderChild(region))}
                        {/* {
                            this.renderImage(image)
                        } */}
                    </Paper>
                    <Divider />
                </div>
            )
        }
        return (
            <div></div>
        )
    }

    render() {
        console.log(this.state)
        return (
            <>
                <span style={{ zoom: `${this.props.zoomPercent}%` }}>{this.renderPage(this.props.page, this.props.image)}</span>
                {this.renderModal()}
            </>
        )
    }

}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    block_highlight: state.block_highlight.block,
    block_page: state.block_highlight.page_no,
    sentence_highlight: state.sentence_highlight.sentence,
    percent: state.fetchpercent.percent,
    status: state.showimagestatus.status,
    switch_style: state.switch_style.status,
    fontSize: state.fetch_slider_pixel.percent
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        highlightSentence,
        clearHighlighBlock,
        cancelMergeSentence
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(OcrPageCard);
