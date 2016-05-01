'use strict';
const Scheming  = require('scheming');
const NAMESPACE = 'AlternativeVote'
const OPTIONS   = { seal : true, strict : false };

const Types = Scheming.TYPES;

const ID = {
  type    : Types.String,
  default : '',
}

const STRING = {
  type    : Types.String,
  default : '',
}

const START_END_DATE = {
  type    : {
    manual : {
      type    : Types.Boolean,
      default : true
    },
    date   : {
      type    : Types.Date,
      default : () => {
        return Date.now();
      }
    }
  },
  default : {}
}

const STATUSES = {
  EDITING   : 'editing',
  ACTIVE    : 'active',
  COMPLETED : 'completed',
}

const STATUS = {
  type     : Types.String,
  default  : STATUSES.EDITING,
  validate : (value) => {
    for (const status of STATUSES) {
      if (value === status) {
        return true;
      }
    }

    return `${value} is not a valid election status.`
  }
}

const Voter = Scheming.create(`${NAMESPACE}Voter`, {
  id    : ID,
  email : STRING,
  name  : STRING,
}, OPTIONS);

const ROLE = {
  isPublic : {
    type    : Types.Boolean,
    default : false
  },
  members  : {
    type    : [Voter],
    default : []
  }
}

const ELECTION_ROLES = {
  type    : {
    viewers        : ROLE,
    voters         : ROLE,
    administrators : ROLE,
    owners         : ROLE,
  },
  default : {}
}

const Account = Scheming.create(`${NAMESPACE}Account`, {
  id    : ID,
  type  : STRING,
  voter : Voter,
}, OPTIONS);

const Candidate = Scheming.create(`${NAMESPACE}Candidate`, {
  id          : ID,
  name        : STRING,
  description : STRING,
  members     : {
    type    : [Voter],
    default : []
  }
}, OPTIONS);

const Ballot = Scheming.create(`${NAMESPACE}Ballot`, {
  id    : ID,
  voter : Voter,
  votes : {
    type    : [Candidate],
    default : [],
  }
}, OPTIONS);

const Category = Scheming.create(`${NAMESPACE}Category`, {
  id         : ID,
  name       : STRING,
  candidates : {
    type    : [Candidate],
    default : [],
  },
  ballots    : {
    type    : [Ballot],
    default : [],
  }
}, OPTIONS);

const Election    = Scheming.create(`${NAMESPACE}Election`, {
  id            : ID,
  name          : STRING,
  status        : STATUS,
  start         : START_END_DATE,
  end           : START_END_DATE,
  roles         : ELECTION_ROLES,
  candidates    : {
    type    : [Candidate],
    default : []
  },
  multiCategory : {
    type    : Types.Boolean,
    default : false,
  },
  categories    : {
    type    : [Category],
    default : []
  },
}, OPTIONS);
Election.STATUSES = STATUSES;

module.exports = {
  Election, Category, Ballot, Candidate, Account, Voter
}