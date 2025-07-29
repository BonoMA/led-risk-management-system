import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { businessUnits } from '../data/mockData';
import { Incident } from '../types';

interface IncidentFormProps {
  incident?: Partial<Incident>;
  onSubmit: (incident: Partial<Incident>) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

const IncidentForm: React.FC<IncidentFormProps> = ({ 
  incident, 
  onSubmit, 
  onCancel, 
  mode 
}) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<Partial<Incident>>({
    incidentName: incident?.incidentName || '',
    incidentDate: incident?.incidentDate || '',
    discoveryDate: incident?.discoveryDate || '',
    keyProcess: incident?.keyProcess || '',
    incidentDescription: incident?.incidentDescription || '',
    rootCause: incident?.rootCause || '',
    potentialLoss: incident?.potentialLoss || 0,
    recovery: incident?.recovery || 0,
    recoverySource: incident?.recoverySource || '',
    causeOfAccident: incident?.causeOfAccident || 'People',
    causeOfAccidentDescription: incident?.causeOfAccidentDescription || '',
    involvedParties: incident?.involvedParties || 'Internal',
    riskMitigation: incident?.riskMitigation || '',
    actionPlan: incident?.actionPlan || '',
    status: incident?.status || 'Open',
    businessUnit: incident?.businessUnit || '',
    ...incident
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 计算实际损失
  const actualLoss = (formData.potentialLoss || 0) - (formData.recovery || 0);

  // 更新实际损失
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      actualLoss
    }));
  }, [formData.potentialLoss, formData.recovery]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 必填字段验证
    if (!formData.incidentName || formData.incidentName.length < 5) {
      newErrors.incidentName = '事件名称至少需要5个字符';
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = '事件日期为必填项';
    }

    if (!formData.discoveryDate) {
      newErrors.discoveryDate = '发现日期为必填项';
    }

    if (!formData.keyProcess) {
      newErrors.keyProcess = '关键流程为必填项';
    }

    if (!formData.incidentDescription || formData.incidentDescription.length < 10) {
      newErrors.incidentDescription = '事件描述至少需要10个字符';
    }

    if (!formData.rootCause) {
      newErrors.rootCause = '根本原因为必填项';
    }

    if (!formData.causeOfAccidentDescription) {
      newErrors.causeOfAccidentDescription = '事故原因描述为必填项';
    }

    if (!formData.riskMitigation) {
      newErrors.riskMitigation = '风险缓解措施为必填项';
    }

    if (!formData.actionPlan) {
      newErrors.actionPlan = '行动计划为必填项';
    }

    if (!formData.businessUnit) {
      newErrors.businessUnit = '业务单位为必填项';
    }

    // 日期关系验证
    if (formData.incidentDate && formData.discoveryDate) {
      if (new Date(formData.incidentDate) > new Date(formData.discoveryDate)) {
        newErrors.discoveryDate = '发现日期不能早于事件日期';
      }
    }

    // 数值验证
    if (formData.potentialLoss && formData.potentialLoss < 0) {
      newErrors.potentialLoss = '潜在损失不能为负数';
    }

    if (formData.recovery && formData.recovery < 0) {
      newErrors.recovery = '回收金额不能为负数';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: Partial<Incident> = {
      ...formData,
      actualLoss,
      createdBy: currentUser ? {
        name: currentUser.name,
        employeeId: currentUser.employeeId,
        position: currentUser.position
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof Incident, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === 'create' ? '新建事件' : mode === 'edit' ? '编辑事件' : '事件详情'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          请填写事件相关信息
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 事件名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              事件名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.incidentName ? 'border-red-500' : ''}`}
              value={formData.incidentName}
              onChange={(e) => handleInputChange('incidentName', e.target.value)}
              disabled={isReadOnly}
              minLength={5}
            />
            {errors.incidentName && (
              <p className="mt-1 text-sm text-red-600">{errors.incidentName}</p>
            )}
          </div>

          {/* 业务单位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              业务单位 <span className="text-red-500">*</span>
            </label>
            <select
              className={`form-select ${errors.businessUnit ? 'border-red-500' : ''}`}
              value={formData.businessUnit}
              onChange={(e) => handleInputChange('businessUnit', e.target.value)}
              disabled={isReadOnly}
            >
              <option value="">请选择业务单位</option>
              {businessUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            {errors.businessUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.businessUnit}</p>
            )}
          </div>

          {/* 事件日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              事件日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`form-input ${errors.incidentDate ? 'border-red-500' : ''}`}
              value={formData.incidentDate}
              onChange={(e) => handleInputChange('incidentDate', e.target.value)}
              disabled={isReadOnly}
            />
            {errors.incidentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.incidentDate}</p>
            )}
          </div>

          {/* 发现日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              发现日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`form-input ${errors.discoveryDate ? 'border-red-500' : ''}`}
              value={formData.discoveryDate}
              onChange={(e) => handleInputChange('discoveryDate', e.target.value)}
              disabled={isReadOnly}
            />
            {errors.discoveryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.discoveryDate}</p>
            )}
          </div>

          {/* 关键流程 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              关键流程 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.keyProcess ? 'border-red-500' : ''}`}
              value={formData.keyProcess}
              onChange={(e) => handleInputChange('keyProcess', e.target.value)}
              disabled={isReadOnly}
            />
            {errors.keyProcess && (
              <p className="mt-1 text-sm text-red-600">{errors.keyProcess}</p>
            )}
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              状态 <span className="text-red-500">*</span>
            </label>
            <select
              className={`form-select ${errors.status ? 'border-red-500' : ''}`}
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={isReadOnly}
            >
              <option value="Open">开放</option>
              <option value="Closed">已关闭</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>
        </div>

        {/* 事件描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            事件描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className={`form-input ${errors.incidentDescription ? 'border-red-500' : ''}`}
            value={formData.incidentDescription}
            onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
            disabled={isReadOnly}
            minLength={10}
          />
          {errors.incidentDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.incidentDescription}</p>
          )}
        </div>

        {/* 根本原因 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            根本原因 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className={`form-input ${errors.rootCause ? 'border-red-500' : ''}`}
            value={formData.rootCause}
            onChange={(e) => handleInputChange('rootCause', e.target.value)}
            disabled={isReadOnly}
          />
          {errors.rootCause && (
            <p className="mt-1 text-sm text-red-600">{errors.rootCause}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 潜在损失 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              潜在损失 (IDR)
            </label>
            <input
              type="number"
              min="0"
              className={`form-input ${errors.potentialLoss ? 'border-red-500' : ''}`}
              value={formData.potentialLoss || ''}
              onChange={(e) => handleInputChange('potentialLoss', parseFloat(e.target.value) || 0)}
              disabled={isReadOnly}
            />
            {errors.potentialLoss && (
              <p className="mt-1 text-sm text-red-600">{errors.potentialLoss}</p>
            )}
          </div>

          {/* 回收金额 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              回收金额 (IDR)
            </label>
            <input
              type="number"
              min="0"
              className={`form-input ${errors.recovery ? 'border-red-500' : ''}`}
              value={formData.recovery || ''}
              onChange={(e) => handleInputChange('recovery', parseFloat(e.target.value) || 0)}
              disabled={isReadOnly}
            />
            {errors.recovery && (
              <p className="mt-1 text-sm text-red-600">{errors.recovery}</p>
            )}
          </div>

          {/* 实际损失 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              实际损失 (IDR)
            </label>
            <input
              type="number"
              className="form-input bg-gray-100"
              value={actualLoss}
              disabled
            />
          </div>
        </div>

        {/* 回收来源 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            回收来源
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.recoverySource || ''}
            onChange={(e) => handleInputChange('recoverySource', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 事故原因 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              事故原因 <span className="text-red-500">*</span>
            </label>
            <select
              className={`form-select ${errors.causeOfAccident ? 'border-red-500' : ''}`}
              value={formData.causeOfAccident}
              onChange={(e) => handleInputChange('causeOfAccident', e.target.value)}
              disabled={isReadOnly}
            >
              <option value="People">人员</option>
              <option value="Process">流程</option>
              <option value="System">系统</option>
              <option value="External Factors">外部因素</option>
            </select>
            {errors.causeOfAccident && (
              <p className="mt-1 text-sm text-red-600">{errors.causeOfAccident}</p>
            )}
          </div>

          {/* 涉及方 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              涉及方 <span className="text-red-500">*</span>
            </label>
            <select
              className={`form-select ${errors.involvedParties ? 'border-red-500' : ''}`}
              value={formData.involvedParties}
              onChange={(e) => handleInputChange('involvedParties', e.target.value)}
              disabled={isReadOnly}
            >
              <option value="Internal">内部</option>
              <option value="External">外部</option>
              <option value="Both">内外都有</option>
            </select>
            {errors.involvedParties && (
              <p className="mt-1 text-sm text-red-600">{errors.involvedParties}</p>
            )}
          </div>
        </div>

        {/* 事故原因描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            事故原因描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className={`form-input ${errors.causeOfAccidentDescription ? 'border-red-500' : ''}`}
            value={formData.causeOfAccidentDescription}
            onChange={(e) => handleInputChange('causeOfAccidentDescription', e.target.value)}
            disabled={isReadOnly}
          />
          {errors.causeOfAccidentDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.causeOfAccidentDescription}</p>
          )}
        </div>

        {/* 风险缓解措施 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            风险缓解措施 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className={`form-input ${errors.riskMitigation ? 'border-red-500' : ''}`}
            value={formData.riskMitigation}
            onChange={(e) => handleInputChange('riskMitigation', e.target.value)}
            disabled={isReadOnly}
          />
          {errors.riskMitigation && (
            <p className="mt-1 text-sm text-red-600">{errors.riskMitigation}</p>
          )}
        </div>

        {/* 行动计划 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            行动计划 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className={`form-input ${errors.actionPlan ? 'border-red-500' : ''}`}
            value={formData.actionPlan}
            onChange={(e) => handleInputChange('actionPlan', e.target.value)}
            disabled={isReadOnly}
          />
          {errors.actionPlan && (
            <p className="mt-1 text-sm text-red-600">{errors.actionPlan}</p>
          )}
        </div>

        {/* 附件 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            附件
          </label>
          <input
            type="file"
            className="form-input"
            onChange={(e) => handleInputChange('attachment', e.target.files?.[0])}
            disabled={isReadOnly}
          />
        </div>

        {/* 按钮组 */}
        {!isReadOnly && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {mode === 'create' ? '保存草稿' : '保存更改'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default IncidentForm; 