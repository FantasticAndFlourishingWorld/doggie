def createApplication(self):

      conn = sqlite3.connect(self.dbPath)
      conn.execute('''CREATE TABLE IF NOT EXISTS Applicationtable '''+'''
          (
          prid INTEGER PRIMARY KEY,
          url TEXT,
          protocol_edition TEXT,
          state_code TEXT,
          state_code_description TEXT,
          Content_Length TEXT,
          SINA_LB TEXT,
          Server TEXT,
          Connection TEXT,
          Api_Server_IP TEXT,
          SINA_TS TEXT,
          Date TEXT,
          Content_Type TEXT,
          state_code TEXT,
          state_code_description TEXT,
          protocol_edition TEXT,
          Accept_Language TEXT,
          Accept_Encoding TEXT,
          Accept TEXT,
          User_Agent TEXT,
          Host TEXT,
          Referer TEXT,
          Cookie TEXT,
          response_body TEXT
          );''')

      conn.close()
