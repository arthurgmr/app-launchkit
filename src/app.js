const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const app = express ()

Sentry.init({
    dsn: "https://e2a1be75b76b47989f66c0ab0989a198@o1085985.ingest.sentry.io/6097650",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(session)
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)

app.use(Sentry.Handlers.errorHandler());

app.set("view engine", "njk")

nunjucks.configure("src/app/views", {
    express: app,
    autoescape: false,
    noCache: true
})

module.exports = { app }

