import { Fragment } from "react";

interface AuthorProps {
  author: {
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
  };
}

export default function ResourceDetailAuthor({ author }: AuthorProps) {
  return (
    <Fragment>
      <div className="position-relative mt-10 mb-10">
        <div className="shape bg-dot primary rellax w-16 h-17" data-rellax-speed="1" style={{ bottom: '0.5rem', right: '-1.7rem', zIndex: 0 }}></div>
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <div className="bg-light rounded py-6 px-6 px-md-10">
              <div className="row gx-0">
                <div className="col-md-3 text-center">
                  <figure className="mb-0">
                    <img 
                      className="rounded-circle w-15 d-inline" 
                      src={author.imageUrl} 
                      alt={author.name} 
                      style={{ width: '130px', height: '130px', objectFit: 'cover' }} 
                    />
                  </figure>
                </div>
                
                <div className="col-md-9 ps-md-7">
                  <div className="post-header mb-3">
                    <h3 className="h4 mb-0">{author.name}</h3>
                    <p className="lead fs-lg mb-0 text-primary">{author.role}</p>
                  </div>
                  
                  <p className="mb-0">
                    {author.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
} 