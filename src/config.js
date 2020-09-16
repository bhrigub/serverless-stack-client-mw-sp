const dev = {
  STRIPE_KEY: "pk_test_51HNagTGyN1l4c6Hd0eszHv3kr5dkDxlbGBDHuy1E6m6KIeDmM1yrrOPb6cOywDilDviJMok01mk8mzRoqhCSGdEb005VBxcOBQ",
  s3: {
    REGION: "us-east-1",
    BUCKET: "mustwanderlust-app-2-api-dev-attachmentsbucket-km9jqh5u2obx"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://tl0mbjt082.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_oSSlRGVQa",
    APP_CLIENT_ID: "2oqo0858bgk00davc0sdnk6gls",
    IDENTITY_POOL_ID: "us-east-1:3695dc35-cebc-4b0c-aeb9-872f82a4f95f"
  }
};

const prod = {
	STRIPE_KEY: "pk_test_51HNagTGyN1l4c6Hd0eszHv3kr5dkDxlbGBDHuy1E6m6KIeDmM1yrrOPb6cOywDilDviJMok01mk8mzRoqhCSGdEb005VBxcOBQ",
	s3: {
		REGION: "us-east-1",
		BUCKET: "mustwanderlust-space--app-data"
	},
	apiGateway: {
		REGION: "us-east-1",
		URL: "https://2hj4n3cqii.execute-api.us-east-1.amazonaws.com/prod"
	},
	cognito: {
		REGION: "us-east-1",
		USER_POOL_ID: "us-east-1_tasfFK1mE",
		APP_CLIENT_ID: "1sqpa3r0jrlvfatn8vt324qebl",
		IDENTITY_POOL_ID: "us-east-1:f25f1889-5663-4b6f-b57c-e9ea2ef1dbc0"
	}
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 1000000,
  ...config
};