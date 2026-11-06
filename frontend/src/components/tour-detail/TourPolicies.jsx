import {
  CheckCircle2,
  XCircle,
  Baby,
  Info,
} from "lucide-react";

function PolicyBlock({ icon: Icon, title, content, className = "" }) {
  if (!content) return null;

  return (
    <div className={`td-policy-block ${className}`}>
      <h3>
        <Icon size={20} />
        {title}
      </h3>

      <div className="td-policy-text">{content}</div>
    </div>
  );
}

function TourPolicies({ policies }) {
  if (!policies) {
    return (
      <section className="td-section" id="tour-policies">
        <h2>Chính sách Tour</h2>
        <p className="td-muted">
          Chính sách đang được cập nhật.
        </p>
      </section>
    );
  }

  return (
    <section className="td-section" id="tour-policies">
      <h2>Chính sách và dịch vụ Tour</h2>

      <div className="td-policy-grid">
        <PolicyBlock
          icon={CheckCircle2}
          title="Giá Tour bao gồm"
          content={policies.price_includes}
          className="td-policy-positive"
        />

        <PolicyBlock
          icon={XCircle}
          title="Giá Tour không bao gồm"
          content={policies.price_excludes}
          className="td-policy-negative"
        />
      </div>

      <PolicyBlock
        icon={Baby}
        title="Chính sách dành cho trẻ em"
        content={policies.children_policy}
      />

      <PolicyBlock
        icon={Info}
        title="Chính sách hủy Tour"
        content={policies.cancellation_policy}
      />

      <PolicyBlock
        icon={Info}
        title="Chính sách thanh toán"
        content={policies.payment_policy}
      />

      <PolicyBlock
        icon={Info}
        title="Lưu ý khác"
        content={policies.additional_notes}
      />
    </section>
  );
}

export default TourPolicies;