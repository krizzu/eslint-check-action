FROM node:10-slim

COPY . /eslint_check_action

WORKDIR /eslint_check_action

LABEL maintainer="Krzysztof Borowy <dev@krizzu.dev>"
LABEL com.github.actions.name="ESLint check"
LABEL com.github.actions.description="Runs ESlint check in your project and annotate errors/warning in a PR."
LABEL com.github.actions.icon="octagon"
LABEL com.github.actions.color="green"

RUN ["yarn", "install"]

RUN ["yarn", "build"]

ENTRYPOINT ["/eslint_check_action/start.sh"]
