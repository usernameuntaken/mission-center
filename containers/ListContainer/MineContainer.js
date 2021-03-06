import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import List from '../../components/List'
import { show as formDialogShow, show, getBo } from '../../actions/form'
import map from 'lodash/map'
import { show as confirmDialogShow, hide as confirmDialogHide } from '../../actions/confirm'
import { getRandomColor } from '../../components/RandomColor'
import  PageContainer  from '../PageContainer'
import timeFilter from '../../filter/time'

class MineContainer extends Component {
		render() {
			const { items, pagination } = this.props;
			const showPagination = pagination.pageTotal > 1 ? <PageContainer items={pagination.pageTotal} /> : '';
			let node = map(items, (item, i) => {
				let {startParticipant, name, dueDate, startTime, icon} = item;
				// let uname = (historicProcessInstance && historicProcessInstance.startParticipant && historicProcessInstance.startParticipant.name)||'';
				let processInstance = item;
				let processCurName = '';
				let processCurAvatar = icon ? <span className={"avatar mine-avatar avatar-"+icon}></span> : <span className={"avatar mine-avatar avatar-icon-1"}></span>;
				let processTitle = name || '';
				let processkeyFeature = this.getProcessKeyFeature(processInstance);
				let processStatus = this.getProcessStatus(processInstance);
				let processCreateTime = new Date(startTime).format('yyyy-MM-dd HH:mm');
				let processHandlerText = `当前环节：`;
				return (
					<div key={i} className="item">
							<div className="box" onClick={this.showDetail(item)}>
								<div className="item-info">
									<div className="l">
										{processCurName}
										{processCurAvatar}
									</div>
									<div className="m">
										<div>
											<h3>{processTitle}</h3>
											{processkeyFeature}
										</div>
									</div>
									<div className="r">
										<span className="item-info-cell">{`提交时间：${processCreateTime}`}</span>
									</div>
								</div>
								<div className="item-status">
										{processStatus}
								</div>
							</div>
					</div>
				)
			})

			return (
				<div className="main-list-wrap">
					<List>{node}</List>
					{showPagination}
				</div>
			)
    }
		getProcessKeyFeature(processInstance){
			let str = null, list = null, keyFeatureStr = processInstance.keyFeature;
			try{list = JSON.parse(processInstance.keyFeature);}catch(e){}
			if(list && Object.prototype.toString.call(list) == '[object Array]' ){
				str = list.map((item,index) =>{
					return <li key={index}>{item.key}:{item.value}</li>
				});
			}
			return <ul className="remark-list">{str}</ul>;
		}
		// 我发起的几种状态 state: run 审批中 end 已完成 delete 已中止
		getProcessStatus(processInstance){
			let str = '';
			if(processInstance.processDefinitionId.indexOf('processKey') > -1){
				str = <span className="btn-tip btn-tip-done">已提交</span>;
			} else {
				if(/^tempSave/.test(processInstance.processDefinitionId)){
						str = <span className="btn-tip btn-tip-done">草稿</span>;
				} else if(processInstance.state === 'end' && (processInstance.deleteReason === 'ACTIVITI_DELETED'||processInstance.deleteReason === 'delete'||processInstance.deleteReason === 'stop')){
					str = <span className="btn-tip btn-tip-stop">已终止</span>;
				} else if(processInstance.state === 'end' && processInstance.deleteReason === 'WITHDRAW_SUBMIT'){
					str = <span className="btn-tip btn-tip-done">草稿</span>;
				} else if(processInstance.state === 'end' && processInstance.deleteReason == null){
						str = <span className="btn-tip btn-tip-done">已完成</span>;
				} else if(processInstance.state == 'delete') {
					str = <span className="btn-tip btn-tip-stop">已终止</span>;
				} else {
					str = <span className="btn-tip btn-tip-doing">审批中</span>;
				}
			}
			// str = processInstance.processDefinitionId;
			return str;
		}
    showDetail(item) {
        return (e) => {
					e.preventDefault()
            this.props.getBo(item)
        }
    }

    submit (item) {
        return (e) => {
            e.preventDefault()
            this.props.confirmDialogShow(`确认要删除"${item.title}"吗？`, () => {
                console.log(item)
                this.props.confirmDialogHide()
            })
        }
    }
    delete (item) {
        return (e) => {
            e.preventDefault()
            this.props.confirmDialogShow(`确认要提交"${item.title}"吗？`, () => {
                this.props.confirmDialogHide()
            })
        }
    }
    edit (item) {
        return (e) => {
            e.preventDefault()
            let url = `${window.$ctx}/static/html/rt/browse.html?pk_bo=${item.formdata.form.pk_bo}&pk_boins=${item.formdata.form.pk_boins}`
            this.props.formDialogShow(url)
        }
    }
    check (item) {
        return (e) => {
            e.preventDefault()
            let url = `${window.$ctx}/static/html/rt/browse.html?pk_bo=${item.formdata.form.pk_bo}&pk_boins=${item.formdata.form.pk_boins}`
            this.props.formDialogShow(url)
        }
    }
}

MineContainer.propTypes = {
    items: PropTypes.array.isRequired,
		pagination: PropTypes.object.isRequired,
    formDialogShow: PropTypes.func.isRequired,
    confirmDialogShow: PropTypes.func.isRequired,
    confirmDialogHide: PropTypes.func.isRequired
}

export default connect(
    ()=>({}),
    { formDialogShow, confirmDialogShow, confirmDialogHide, show, getBo }
)(MineContainer)
