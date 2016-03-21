import logging

def createLogger():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    fh = logging.FileHandler('MasterLog.log',mode='a')
    fh.setLevel(logging.WARNING)

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    ch.setFormatter(formatter)
    fh.setFormatter(formatter)

    logger.addHandler(ch)
    logger.addHandler(fh)
    return logger

# Eaxmple usage
#     logger = createLogger()
#     logger.debug('debug message')
#     logger.info('info message')
#     logger.warning('warning message')
#     logger.critical('critical message')
