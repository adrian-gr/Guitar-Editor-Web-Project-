<?php
    class User {
        private string $username;
        private string $password;

        public function __construct(string $username, string $password) {
            $this->username = $username;
            $this->password = $password;
        }

        public function getUsername(): string {
            return $this->username;
        }

        public function getPassword(): string {
            return $this->password;
        }

        public function jsonSerialize(): array {
            $fieldsToSerialize = ['username', 'password'];
            $jsonArray = [];

            foreach ($fieldsToSerialize as $fieldName) {
                $jsonArray[$fieldName] = $this->$fieldName;
            }

            return $jsonArray;
        }
    }
?>