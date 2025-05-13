import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-10 pb-12 pt-md-14 pb-md-16 text-center">
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
            <div className="post-header">
              <h1 className="display-1 mb-4">{title}</h1>
              {subtitle && <p className="lead fs-lg mb-0">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader; 