import React, { useState, useEffect } from 'react';
import { Incident } from '../types';
import { businessUnits } from '../data/mockData';

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
  const [formData, setFormData] = useState<Partial<Incident>>({
    incidentName: incident?.incidentName || '',
    incidentDate: incident?.incidentDate || '',
    discoveryDate: incident?.discoveryDate || '',
    businessUnit: incident?.businessUnit || '',
    potentialLoss: incident?.potentialLoss || 0,
    recovery: incident?.recovery || 0,
    recoverySource: incident?.recoverySource || '',
    causeOfAccident: incident?.causeOfAccident || '',
    status: incident?.status || 'Open',
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

    if (!formData.causeOfAccident) {
      newErrors.causeOfAccident = '事故原因为必填项';
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

    onSubmit({
      ...formData,
      actualLoss
    });
  };

  const handleInputChange = (field: keyof Incident, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isViewMode = mode === 'view';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              事件名称 *
            </label>
            <input
              type="text"
              className={`form-input ${errors.incidentName ? 'border-red-500' : ''}`}
              value={formData.incidentName}
              onChange={(e) => handleInputChange('incidentName', e.target.value)}
              disabled={isViewMode}
              required
            />
            {errors.incidentName && (
              <p className="mt-1 text-sm text-red-600">{errors.incidentName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              业务单位 *
            </label>
            <select
              className={`form-select ${errors.businessUnit ? 'border-red-500' : ''}`}
              value={formData.businessUnit}
              onChange={(e) => handleInputChange('businessUnit', e.target.value)}
              disabled={isViewMode}
              required
            >
              <option value="">请选择业务单位</option>
              {businessUnits.map(unit => (
                <option key={unit.id} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
            {errors.businessUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.businessUnit}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              事件日期 *
            </label>
            <input
              type="date"
              className={`form-input ${errors.incidentDate ? 'border-red-500' : ''}`}
              value={formData.incidentDate}
              onChange={(e) => handleInputChange('incidentDate', e.target.value)}
              disabled={isViewMode}
              required
            />
            {errors.incidentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.incidentDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              发现日期 *
            </label>
            <input
              type="date"
              className={`form-input ${errors.discoveryDate ? 'border-red-500' : ''}`}
              value={formData.discoveryDate}
              onChange={(e) => handleInputChange('discoveryDate', e.target.value)}
              disabled={isViewMode}
              required
            />
            {errors.discoveryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.discoveryDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* 损失信息 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">损失信息</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              潜在损失 (¥)
            </label>
            <input
              type="number"
              className={`form-input ${errors.potentialLoss ? 'border-red-500' : ''}`}
              value={formData.potentialLoss}
              onChange={(e) => handleInputChange('potentialLoss', parseFloat(e.target.value) || 0)}
              disabled={isViewMode}
              min="0"
              step="0.01"
            />
            {errors.potentialLoss && (
              <p className="mt-1 text-sm text-red-600">{errors.potentialLoss}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              回收金额 (¥)
            </label>
            <input
              type="number"
              className={`form-input ${errors.recovery ? 'border-red-500' : ''}`}
              value={formData.recovery}
              onChange={(e) => handleInputChange('recovery', parseFloat(e.target.value) || 0)}
              disabled={isViewMode}
              min="0"
              step="0.01"
            />
            {errors.recovery && (
              <p className="mt-1 text-sm text-red-600">{errors.recovery}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              实际损失 (¥)
            </label>
            <input
              type="number"
              className="form-input bg-gray-100"
              value={actualLoss}
              disabled
              readOnly
            />
            <p className="mt-1 text-sm text-gray-500">自动计算</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            回收来源
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.recoverySource}
            onChange={(e) => handleInputChange('recoverySource', e.target.value)}
            disabled={isViewMode}
            placeholder="例如：保险赔付、供应商赔偿等"
          />
        </div>
      </div>

      {/* 事故原因 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">事故原因</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            事故原因 *
          </label>
          <input
            type="text"
            className={`form-input ${errors.causeOfAccident ? 'border-red-500' : ''}`}
            value={formData.causeOfAccident}
            onChange={(e) => handleInputChange('causeOfAccident', e.target.value)}
            disabled={isViewMode}
            required
            placeholder="请描述事故的具体原因"
          />
          {errors.causeOfAccident && (
            <p className="mt-1 text-sm text-red-600">{errors.causeOfAccident}</p>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      {!isViewMode && (
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
            {mode === 'create' ? '创建事件' : '保存更改'}
          </button>
        </div>
      )}

      {isViewMode && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            关闭
          </button>
        </div>
      )}
    </form>
  );
};

export default IncidentForm; 