FROM node:10-slim

COPY . /eslint_check_action

WORKDIR /eslint_check_action

ENTRYPOINT ["/eslint_check_action/start.sh"]

LABEL maintainer="Krzysztof Borowy <dev@krizzu.dev>"
LABEL com.github.actions.name="ESLint check action"
LABEL com.github.actions.description="Run Eslint checks in project"
LABEL com.github.actions.icon="octagon"
LABEL com.github.actions.color="green"


